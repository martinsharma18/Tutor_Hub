import { useEffect } from "react";

const DEFAULT_TITLE = "Best Tuitions — Find Verified Home & Online Tutors in Nepal";

/**
 * Sets document title + meta description per route. This is a single-page app, so without this
 * every route keeps the index.html title — bad for browser tabs, bookmarks, and search results.
 *
 * NOTE: crawlers that don't execute JavaScript still only see index.html's static tags. Proper
 * per-page SEO for teacher profiles needs SSR or prerendering — out of scope here.
 */
export const usePageMeta = ({ title, description } = {}) => {
  useEffect(() => {
    document.title = title ? `${title} — Best Tuitions` : DEFAULT_TITLE;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
};

export default usePageMeta;
