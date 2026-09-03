import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";

import "./App.css";

import {
  EventCard,
  MemoizedEventCard,
} from "./components/EventCard";

const API_URL = "http://localhost:5000/api/events";

function App() {
  /* =========================
     PERFORMANCE TOGGLES
  ========================= */

  const [memoEnabled, setMemoEnabled] = useState(true);
  const [callbackEnabled, setCallbackEnabled] = useState(true);
  const [useMemoEnabled, setUseMemoEnabled] = useState(true);
  const [liveClock, setLiveClock] = useState(false);

  /* =========================
     EVENTS
  ========================= */

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     CLOCK
  ========================= */

  const [clock, setClock] = useState(Date.now());

  /* =========================
     RENDER COUNTERS

     Ref is used so EventCard can
     increment its count without
     causing another React render.
  ========================= */

  const renderCountsRef = useRef({});

  /* =========================
     DRAG STATE
  ========================= */

  const [draggedEvent, setDraggedEvent] =
    useState(null);

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  /* =========================
     FETCH EVENTS
  ========================= */

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch events"
          );
        }

        const data = await response.json();

        setEvents(data);
        setError("");
      } catch (err) {
        console.error(err);

        setError(
          "Backend connection failed. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* =========================
     LIVE CLOCK

     This deliberately causes the
     App component to re-render.
     It helps demonstrate the
     difference between optimized
     and non-optimized cards.
  ========================= */

  useEffect(() => {
    if (!liveClock) return;

    const interval = setInterval(() => {
      setClock(Date.now());
    }, 450);

    return () => clearInterval(interval);
  }, [liveClock]);

  /* =========================
     DRAG START HANDLERS
  ========================= */

  const memoizedDragStart = useCallback(
    (event) => {
      setDraggedEvent(event);
    },
    []
  );

  const normalDragStart = (event) => {
    setDraggedEvent(event);
  };

  const dragStartHandler =
    callbackEnabled
      ? memoizedDragStart
      : normalDragStart;

  /* =========================
     DRAG OVER
  ========================= */

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /* =========================
     DROP + BACKEND UPDATE
  ========================= */

  const handleDrop = async (day) => {
    if (!draggedEvent) return;

    const updatedEvent = {
      ...draggedEvent,
      day,
    };

    /* Update frontend immediately */

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === draggedEvent.id
          ? updatedEvent
          : event
      )
    );

    try {
      const response = await fetch(
        `${API_URL}/${draggedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update event"
        );
      }

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Event could not be updated on the backend."
      );
    }

    setDraggedEvent(null);
  };

  /* =========================
     useMemo EVENT GROUPING
  ========================= */

  const memoizedEventsByDay = useMemo(() => {
    const groupedEvents = {};

    days.forEach((day) => {
      groupedEvents[day] =
        events.filter(
          (event) => event.day === day
        );
    });

    return groupedEvents;
  }, [events]);

  const getEventsForDay = (day) => {
    if (useMemoEnabled) {
      return memoizedEventsByDay[day] || [];
    }

    /* Non-optimized calculation */

    return events.filter(
      (event) => event.day === day
    );
  };

  /* =========================
     RESET COUNTERS
  ========================= */

  const resetCounters = () => {
    renderCountsRef.current = {};

    /*
      Trigger one parent render so
      the empty counters are shown.
    */

    setClock(Date.now());
  };

  /* =========================
     MONITOR CALCULATIONS
  ========================= */

  const renderCounts =
    renderCountsRef.current;

  const totalRenders =
    Object.values(renderCounts).reduce(
      (total, count) => total + count,
      0
    );

  const cardsRendered =
    Object.keys(renderCounts).length;

  /* =========================
     LOADING SCREEN
  ========================= */

  if (loading) {
    return (
      <div className="app">
        <h1>Interactive Calendar</h1>

        <p className="subtitle">
          Loading calendar events...
        </p>
      </div>
    );
  }

  /* =========================
     SELECT CARD COMPONENT
  ========================= */

  const CardComponent =
    memoEnabled
      ? MemoizedEventCard
      : EventCard;

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">

      <h1>Interactive Calendar</h1>

      <p className="subtitle">
        Drag events between days, then flip the switches below to see, in real
        time, what React.memo, useCallback, and useMemo actually do to renders.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* CONTROLS */}

      <div className="controls">

        {/* REACT.MEMO */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={memoEnabled}
              onChange={(e) =>
                setMemoEnabled(
                  e.target.checked
                )
              }
            />

            <span className="slider"></span>

          </label>

          <div>
            <h3>
              React.memo on cards
            </h3>

            <p>
              Skip a card's re-render when its own props haven't changed.
            </p>
          </div>

        </div>

        {/* USE CALLBACK */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={callbackEnabled}
              onChange={(e) =>
                setCallbackEnabled(
                  e.target.checked
                )
              }
            />

            <span className="slider"></span>

          </label>

          <div>
            <h3>
              useCallback for handlers
            </h3>

            <p>
              Keep drag handlers referentially stable.
            </p>
          </div>

        </div>

        {/* USE MEMO */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={useMemoEnabled}
              onChange={(e) =>
                setUseMemoEnabled(
                  e.target.checked
                )
              }
            />

            <span className="slider"></span>

          </label>

          <div>
            <h3>
              useMemo for agenda filter
            </h3>

            <p>
              Cache filtered events and avoid unnecessary calculations.
            </p>
          </div>

        </div>

        {/* LIVE CLOCK */}

        <div className="control-item live-control">

          <label className="switch">

            <input
              type="checkbox"
              checked={liveClock}
              onChange={(e) =>
                setLiveClock(
                  e.target.checked
                )
              }
            />

            <span className="slider"></span>

          </label>

          <div>
            <h3>
              Live Clock
            </h3>

            <p>
              Ticks every 450ms to simulate unrelated state elsewhere in the
              application.
            </p>
          </div>

        </div>

        {/* RESET */}

        <button
          className="reset-button"
          onClick={resetCounters}
        >
          Reset counters
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="content">

        {/* CALENDAR */}

        <div className="calendar-panel">

          <h2>
            WEEK VIEW
          </h2>

          <div className="week">

            {days.map((day) => (

              <div
                className="day-column"
                key={day}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(day)
                }
              >

                <span className="day-name">
                  {day}
                </span>

                {getEventsForDay(day).map(
                  (event) => (

                    <CardComponent
                      key={event.id}
                      event={event}
                      onDragStart={
                        dragStartHandler
                      }
                      renderCountsRef={
                        renderCountsRef
                      }
                    />

                  )
                )}

              </div>

            ))}

          </div>

        </div>

        {/* RENDER MONITOR */}

        <div className="monitor-panel">

          <h2>
            RENDER MONITOR
          </h2>

          <div className="monitor-stats">

            <div>

              <strong>
                {totalRenders}
              </strong>

              <span>
                Total renders logged
              </span>

            </div>

            <div>

              <strong>
                {cardsRendered}/8
              </strong>

              <span>
                Cards that have rendered
              </span>

            </div>

          </div>

          <div className="monitor-list">

            {events.map((event) => {

              const count =
                renderCounts[event.id] || 0;

              const width =
                Math.min(
                  count * 10,
                  100
                );

              return (

                <div
                  className="monitor-row"
                  key={event.id}
                >

                  <span>
                    {event.title}
                  </span>

                  <div className="bar-container">

                    <div
                      className="bar"
                      style={{
                        width:
                          `${width}%`,
                      }}
                    ></div>

                  </div>

                  <span className="count">
                    {count}
                  </span>

                </div>

              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;