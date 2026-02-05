import { RefObject, useEffect, useState } from "react";

type FleeState = {
  style: { transform: string; transition: string; position: "absolute" | "relative"; left: string; top: string };
};

export const useFleeingButton = (
  buttonRef: RefObject<HTMLElement>
): FleeState => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const flee = (pointerX: number, pointerY: number) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const dx = pointerX - buttonCenterX;
      const dy = pointerY - buttonCenterY;
      const distance = Math.hypot(dx, dy);

      // Large detection radius - 250px
      if (distance < 250) {
        // Jump away immediately - teleport style
        const jumpDistance = 150 + Math.random() * 100;
        
        // Direction away from pointer
        const angle = Math.atan2(dy, dx);
        const fleeAngle = angle + Math.PI + (Math.random() - 0.5) * 1.5;
        
        let newX = offset.x + Math.cos(fleeAngle) * jumpDistance;
        let newY = offset.y + Math.sin(fleeAngle) * jumpDistance;
        
        // Keep within screen bounds
        const maxX = window.innerWidth - rect.width - 40;
        const maxY = window.innerHeight - rect.height - 40;
        const minX = -rect.left + 20;
        const minY = -rect.top + 20;
        
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        setOffset({ x: newX, y: newY });
      }
    };

    const handleMouse = (e: MouseEvent) => flee(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        flee(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("touchmove", handleTouch);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [buttonRef, offset]);

  return { 
    style: { 
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      transition: "transform 0.15s ease-out",
      position: "relative" as const,
      left: "0",
      top: "0"
    } 
  };
};
