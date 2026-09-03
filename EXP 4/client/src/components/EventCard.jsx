import { memo } from "react";

function EventCard({
  event,
  onDragStart,
  renderCountsRef,
}) {

  // Count every actual EventCard render
  renderCountsRef.current[event.id] =
    (renderCountsRef.current[event.id] || 0) + 1;

  return (
    <div
      className={`event-card ${event.type}`}
      draggable
      onDragStart={() => onDragStart(event)}
    >
      <div className="event-time">
        {event.time}
      </div>

      <div className="event-title">
        {event.title}
      </div>
    </div>
  );
}


// React.memo prevents unnecessary re-renders
// when event and onDragStart props remain unchanged
const MemoizedEventCard = memo(EventCard);


export {
  EventCard,
  MemoizedEventCard,
};