import { Fragment } from "react";

function WrappableText({ text }: { text: string }) {
  const definitelyAString = typeof text === "string" ? text : "";
  return (
    <>
      {/* add word-breaking space <wbr> around every word */}
      {/* a word is any connected group of english letters */}
      {/* asterisks, stars, music notes, any other character can separate a word */}

      {definitelyAString.split(/(\w+)/).map((word, index) => {
        if (word.match(/\w/)) {
          return (
            <Fragment key={index}>
              <wbr />
              {word}
              <wbr />
            </Fragment>
          );
        } else {
          return word;
        }
      })}
    </>
  );
}

export default WrappableText;
