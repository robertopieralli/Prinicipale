import type { ReactNode } from 'react';
import { wixImage } from '@/lib/wix/media';

/**
 * I post di Wix arrivano in formato Ricos: un albero di nodi, non HTML.
 * Qui lo traduciamo in markup nostro, così l'archivio storico (comunicati,
 * graduatorie, allegati del BUR) eredita la tipografia del sito nuovo invece
 * degli stili dell'editor.
 */

type RicosNode = {
  type?: string;
  id?: string;
  nodes?: RicosNode[];
  textData?: {
    text?: string;
    decorations?: Array<{
      type?: string;
      linkData?: { link?: { url?: string; target?: string; rel?: Record<string, boolean> } };
      colorData?: { foreground?: string };
    }>;
  };
  headingData?: { level?: number };
  imageData?: {
    image?: { src?: { id?: string; url?: string; width?: number; height?: number } };
    altText?: string;
    caption?: string;
  };
  fileData?: { src?: { id?: string; url?: string }; name?: string; type?: string; size?: number };
  videoData?: { video?: { src?: { url?: string; id?: string } } };
  embedData?: { oembed?: { html?: string; url?: string; title?: string } };
  dividerData?: unknown;
  codeBlockData?: unknown;
  buttonData?: { text?: string; link?: { url?: string } };
  tableCellData?: unknown;
};

function decorate(text: string, decorations: RicosNode['textData'] extends infer T ? any : never): ReactNode {
  let node: ReactNode = text;
  const list = (decorations ?? []) as Array<{ type?: string; linkData?: any }>;

  for (const dec of list) {
    switch (dec.type) {
      case 'BOLD':
        node = <strong>{node}</strong>;
        break;
      case 'ITALIC':
        node = <em>{node}</em>;
        break;
      case 'UNDERLINE':
        node = <u>{node}</u>;
        break;
      case 'SPOILER':
        node = <span className="rounded bg-[var(--bg-sunken)] px-1">{node}</span>;
        break;
      case 'LINK': {
        const url = dec.linkData?.link?.url;
        if (!url) break;
        const external = /^https?:\/\//i.test(url);
        node = (
          <a
            href={url}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {node}
          </a>
        );
        break;
      }
      default:
        break;
    }
  }

  return node;
}

function renderNodes(nodes: RicosNode[] | undefined): ReactNode {
  if (!nodes?.length) return null;
  return nodes.map((node, index) => <RicosBlock key={node.id ?? index} node={node} />);
}

function RicosBlock({ node }: { node: RicosNode }): ReactNode {
  switch (node.type) {
    case 'TEXT':
      return <>{decorate(node.textData?.text ?? '', node.textData?.decorations)}</>;

    case 'PARAGRAPH': {
      const children = renderNodes(node.nodes);
      if (!node.nodes?.length) return <p>&nbsp;</p>;
      return <p>{children}</p>;
    }

    case 'HEADING': {
      const level = Math.min(Math.max(node.headingData?.level ?? 2, 2), 4);
      const Tag = (`h${level}` as 'h2' | 'h3' | 'h4');
      return <Tag>{renderNodes(node.nodes)}</Tag>;
    }

    case 'BLOCKQUOTE':
      return <blockquote>{renderNodes(node.nodes)}</blockquote>;

    case 'BULLETED_LIST':
      return <ul>{renderNodes(node.nodes)}</ul>;

    case 'ORDERED_LIST':
      return <ol>{renderNodes(node.nodes)}</ol>;

    case 'LIST_ITEM':
      return <li>{renderNodes(node.nodes)}</li>;

    case 'DIVIDER':
      return <hr className="my-10 border-0 border-t" />;

    case 'IMAGE': {
      const src = wixImage(
        node.imageData?.image?.src?.url ?? node.imageData?.image?.src?.id ?? null,
        1400,
        900,
      );
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={node.imageData?.altText ?? ''}
            loading="lazy"
            className="w-full rounded-2xl border"
          />
          {node.imageData?.caption ? (
            <figcaption className="mt-2 text-sm text-[var(--ink-faint)]">
              {node.imageData.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case 'FILE': {
      const url = node.fileData?.src?.url;
      const name = node.fileData?.name ?? 'Allegato';
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 flex items-center gap-3 rounded-xl border bg-[var(--bg-sunken)] px-4 py-3 no-underline transition hover:border-[var(--line-strong)]"
        >
          <span aria-hidden className="text-lg">📄</span>
          <span className="font-medium text-[var(--ink)]">{name}</span>
          <span className="ml-auto text-xs uppercase tracking-widest text-[var(--ink-faint)]">
            Scarica
          </span>
        </a>
      );
    }

    case 'VIDEO': {
      const url = node.videoData?.video?.src?.url;
      if (!url) return null;
      return (
        <video controls preload="metadata" className="my-8 w-full rounded-2xl border">
          <source src={url} />
        </video>
      );
    }

    case 'EMBED': {
      const url = node.embedData?.oembed?.url;
      if (!url) return null;
      return (
        <p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {node.embedData?.oembed?.title ?? url}
          </a>
        </p>
      );
    }

    case 'BUTTON': {
      const url = node.buttonData?.link?.url;
      if (!url) return null;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 inline-block rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-[var(--brand-ink)] no-underline"
        >
          {node.buttonData?.text ?? 'Apri'}
        </a>
      );
    }

    case 'TABLE':
      return (
        <div className="my-8 overflow-x-auto">
          <table>
            <tbody>{renderNodes(node.nodes)}</tbody>
          </table>
        </div>
      );

    case 'TABLE_ROW':
      return <tr>{renderNodes(node.nodes)}</tr>;

    case 'TABLE_CELL':
      return <td>{renderNodes(node.nodes)}</td>;

    case 'CODE_BLOCK':
      return (
        <pre className="my-6 overflow-x-auto rounded-xl border bg-[var(--bg-sunken)] p-4 text-sm">
          <code>{renderNodes(node.nodes)}</code>
        </pre>
      );

    case 'COLLAPSIBLE_LIST':
    case 'COLLAPSIBLE_ITEM':
    case 'COLLAPSIBLE_ITEM_TITLE':
    case 'COLLAPSIBLE_ITEM_BODY':
      return <>{renderNodes(node.nodes)}</>;

    default:
      // Un nodo sconosciuto non deve far sparire il testo che contiene.
      return <>{renderNodes(node.nodes)}</>;
  }
}

export default function RichContent({
  content,
  fallback,
}: {
  content: { nodes?: RicosNode[] } | null;
  fallback?: string;
}) {
  if (!content?.nodes?.length) {
    if (!fallback) return null;
    return (
      <div className="prose-snami">
        {fallback.split('\n').filter(Boolean).map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }
  return <div className="prose-snami">{renderNodes(content.nodes)}</div>;
}
