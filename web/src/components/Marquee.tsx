import { Fragment } from "react";
import { Offscreen } from "./Offscreen";
import styles from "./Marquee.module.css";

const pairs = [
  ["you won't believe", "why the sky is blue"],
  ["part 4 of 37", "how memory works"],
  ["breaking: again", "what the Stoics meant"],
  ["wait for it", "how money compounds"],
];

function Run() {
  return (
    <span>
      {pairs.map(([doom, learn]) => (
        <Fragment key={doom}>
          <s>{doom}</s>
          <em>{learn}</em>
        </Fragment>
      ))}
    </span>
  );
}

export function Marquee() {
  return (
    <Offscreen className={styles.marq} aria-hidden="true">
      <div className={styles.track}>
        <Run />
        <Run />
      </div>
    </Offscreen>
  );
}
