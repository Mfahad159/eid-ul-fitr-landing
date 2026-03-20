"use client";

import { useRef, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  placement?: Placement;
  offsetValue?: number;
  disabled?: boolean;
};

export function Tooltip({
  label,
  children,
  placement = "top",
  offsetValue = 10,
  disabled = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: !disabled && open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { enabled: !disabled });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {children}
      </div>
      {!disabled && open ? (
        <TooltipPopup
          refs={refs}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          context={context}
          arrowRef={arrowRef}
          label={label}
        />
      ) : null}
    </>
  );
}

function TooltipPopup({ refs, floatingStyles, getFloatingProps, context, arrowRef, label }: any) {
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  if (isTouchDevice) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{ ...floatingStyles, zIndex: 200 }}
        {...getFloatingProps()}
      >
        <div className="rounded-lg border border-[rgba(201,168,76,0.3)] bg-[rgba(13,59,46,0.95)] px-[14px] py-[6px] font-body text-[0.8rem] text-eid-cream shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          {label}
        </div>
        <FloatingArrow
          ref={arrowRef}
          context={context}
          fill="rgba(13,59,46,0.95)"
          stroke="rgba(201,168,76,0.3)"
        />
      </div>
    </FloatingPortal>
  );
}
