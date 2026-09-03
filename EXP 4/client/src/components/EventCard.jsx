import React from "react";

function EventCard({
  event,
  onDragStart,
  renderCountsRef,
}) {
  // Count every actual render without updating React state.
  // This avoids the infinite render loop.
  renderCountsRef.current[event.id] =
    (renderCountsRef.current[event.id] || 0) + 1;

  const handleDragStart = () => {
    onDragStart(event);
  };

  return (
    <div
      className={`event-card ${event.type}`}
      draggable
      onDragStart={handleDragStart}
    >
      <span className="event-time">
        {event.time}
      </span>

      <span className="event-title">
        {event.title}
      </span>
    </div>
  );
}

const MemoizedEventCard = React.memo(EventCard);

export {
  EventCard,
  MemoizedEventCard,
};