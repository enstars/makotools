// RichText.tsx in your components folder
import dynamic from "next/dynamic";

const RTE = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

function RichText() {
  return (
    <RTE
      controls={[
        ["bold", "italic", "underline", "link", "unorderedList"],
        ["h1", "h2", "h3"],
        ["alignLeft", "alignCenter", "alignRight"],
      ]}
      onChange={() => null}
      value=""
    />
  );
}

export default RichText;
