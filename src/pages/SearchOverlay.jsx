import React, { useRef } from "react";
import Search from "components/search/Search";
import { Transition } from "react-transition-group";

export default function SearchOverlay() {
  const ref = useRef();

  const defaultStyle = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "fixed",
    background: "rgba(0, 0, 0, 0)",
    overflowY: "scroll",
    zIndex: 1100,
    transition: "background 100ms ease-in-out",
  };

  const transitionStyles = {
    entering: { background: "rgba(0, 0, 0, 0)" },
    entered: { background: "rgba(0, 0, 0, 0.9)" },
  };

  return (
    <Transition appear={false} in={true} timeout={100} nodeRef={ref}>
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
          ref={ref}
        >
          <Search />
        </div>
      )}
    </Transition>
  );
}
