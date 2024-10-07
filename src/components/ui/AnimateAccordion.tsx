import React, { useState, useRef, useEffect } from "react";

const AnimatedAccordion = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  const [height, setHeight] = useState(0);
  const contentRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && contentRef?.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      className="mb-2"
      style={{
        overflow: "hidden",
        transition: "height 0.3s ease-out",
        height: `${height}px`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default AnimatedAccordion;
