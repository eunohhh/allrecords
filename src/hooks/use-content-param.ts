import { useQueryState } from "nuqs";

export function useContentParam() {
  const [content, setContent] = useQueryState("content", {
    defaultValue: null,
    parse: (value) => value,
    serialize: (value) => value || "",
  });

  return {
    content,
    setContent,
    isOpen: !!content,
  };
}
