import * as React from "react";
import Markdoc, { type Node } from "@markdoc/markdoc";

/** URL-safe id derived from heading text, so headings are deep-linkable. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Flattens a node's descendant text — heading ids need the rendered string. */
function textOf(node: Node): string {
  if (node.type === "text") return String(node.attributes.content ?? "");
  return (node.children ?? []).map(textOf).join("");
}

const markdocConfig = {
  nodes: {
    heading: {
      children: ["inline"],
      attributes: { level: { type: Number, required: true } },
      transform(node: Node, config: Parameters<Node["transformChildren"]>[0]) {
        const level = Number(node.attributes.level ?? 2);
        /* `level` is deliberately not spread through — it is not valid HTML. */
        return new Markdoc.Tag(
          `h${level}`,
          { id: slugify(textOf(node)) },
          node.transformChildren(config),
        );
      },
    },

    link: {
      children: ["inline"],
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
      transform(node: Node, config: Parameters<Node["transformChildren"]>[0]) {
        const href = String(node.attributes.href ?? "");
        const isExternal = /^https?:\/\//i.test(href);
        return new Markdoc.Tag(
          "a",
          {
            href,
            ...(node.attributes.title ? { title: node.attributes.title } : {}),
            /* noopener closes the reverse-tabnabbing hole on new tabs. */
            ...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
          node.transformChildren(config),
        );
      },
    },

    image: {
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        title: { type: String },
      },
      transform(node: Node) {
        return new Markdoc.Tag("img", {
          src: String(node.attributes.src ?? ""),
          alt: String(node.attributes.alt ?? ""),
          loading: "lazy",
          decoding: "async",
        });
      },
    },
  },
};

/** Renders a Keystatic Markdoc body with the site's prose styling. */
export default function PostBody({ node }: { node: Node }) {
  const renderable = Markdoc.transform(node, markdocConfig);
  return (
    <div className="prose-t4e">
      {Markdoc.renderers.react(renderable, React)}
    </div>
  );
}
