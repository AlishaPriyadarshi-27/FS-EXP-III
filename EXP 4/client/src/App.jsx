import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import "./App.css";

import {
  EventCard,
  MemoizedEventCard,
} from "./components/EventCard";


const initialEvents = [
  {
    id: 1,
    title: "Design review",
    time: "10:00",
    day: "Mon",
    type: "meeting",
  },
  {
    id: 2,
    title: "Ship v2.3",
    time: "16:00",
    day: "Mon",
    type: "deadline",
  },
  {
    id: 3,
    title: "1:1 with Sam",
    time: "09:30",
    day: "Tue",
    type: "meeting",
  },
  {
    id: 4,
    title: "Write proposal",
    time: "13:00",
    day: "Wed",
    type: "focus",
  },
  {
    id: 5,
    title: "Client demo",
    time: "15:00",
    day: "Thu",
    type: "meeting",
  },
  {
    id: 6,
    title: "Portfolio review",
    time: "18:00",
    day: "Thu",
    type: "focus",
  },
  {
    id: 7,
    title: "Grocery run",
    time: "10:00",
    day: "Sat",
    type: "personal",
  },
  {
    id: 8,
    title: "Sprint planning",
    time: "11:00",
    day: "Sun",
    type: "meeting",
  },
];


const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];


function App() {

  // =========================
  // OPTIMIZATION SETTINGS
  // =========================

  const [memoEnabled, setMemoEnabled] =
    useState(true);

  const [callbackEnabled, setCallbackEnabled] =
    useState(true);

  const [useMemoEnabled, setUseMemoEnabled] =
    useState(true);

  const [liveClock, setLiveClock] =
    useState(false);


  // =========================
  // EVENTS
  // =========================

  const [events, setEvents] = useState(() => {
    try {
      const savedEvents =
        localStorage.getItem("calendarEvents");

      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
    } catch (error) {
      console.error(error);
    }

    return initialEvents;
  });


  // =========================
  // LIVE CLOCK
  // =========================

  const [clock, setClock] =
    useState(Date.now());


  useEffect(() => {

    if (!liveClock) {
      return;
    }

    const interval = setInterval(() => {

      // Only ONE state update per tick
      setClock(Date.now());

    }, 450);

    return () => clearInterval(interval);

  }, [liveClock]);


  // =========================
  // SAVE EVENTS
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "calendarEvents",
      JSON.stringify(events)
    );

  }, [events]);


  // =========================
  // RENDER COUNTERS
  // =========================

  const renderCountsRef =
    useRef({});


  // Used only to refresh monitor display
  const [monitorVersion, setMonitorVersion] =
    useState(0);


  // =========================
  // DRAGGED EVENT
  // =========================

  const [draggedEvent, setDraggedEvent] =
    useState(null);


  // =========================
  // useCallback VERSION
  // =========================

  const stableDragStart =
    useCallback((event) => {

      setDraggedEvent(event);

    }, []);


  // Intentionally recreated on every render
  // This demonstrates non-optimized callbacks
  const normalDragStart = (event) => {

    setDraggedEvent(event);

  };


  const dragStartHandler =
    callbackEnabled
      ? stableDragStart
      : normalDragStart;


  // =========================
  // DRAG OVER
  // =========================

  const handleDragOver =
    useCallback((event) => {

      event.preventDefault();

    }, []);


  // =========================
  // DROP EVENT
  // =========================

  const stableDrop =
    useCallback((day) => {

      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.id === draggedEvent?.id
            ? {
                ...event,
                day,
              }
            : event
        )
      );

      setDraggedEvent(null);

    }, [draggedEvent]);


  const normalDrop = (day) => {

    if (!draggedEvent) return;

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === draggedEvent.id
          ? {
              ...event,
              day,
            }
          : event
      )
    );

    setDraggedEvent(null);

  };


  const dropHandler =
    callbackEnabled
      ? stableDrop
      : normalDrop;


  // =========================
  // useMemo VERSION
  // =========================

  const memoizedEventsByDay =
    useMemo(() => {

      const grouped = {};

      days.forEach((day) => {

        grouped[day] =
          events.filter(
            (event) =>
              event.day === day
          );

      });

      return grouped;

    }, [events]);


  // =========================
  // GET EVENTS
  // =========================

  const getEventsForDay = (day) => {

    if (useMemoEnabled) {

      return (
        memoizedEventsByDay[day] || []
      );

    }

    return events.filter(
      (event) =>
        event.day === day
    );

  };


  // =========================
  // RESET COUNTERS
  // =========================

  const resetCounters = () => {

    renderCountsRef.current = {};

    setMonitorVersion(
      (previous) => previous + 1
    );

  };


  // =========================
  // MONITOR DATA
  // =========================

  const renderCounts =
    renderCountsRef.current;


  const totalRenders =
    Object.values(renderCounts).reduce(
      (total, count) =>
        total + count,
      0
    );


  const cardsRendered =
    Object.keys(renderCounts).length;


  // =========================
  // CARD VERSION
  // =========================

  const CardComponent =
    memoEnabled
      ? MemoizedEventCard
      : EventCard;


  return (

    <div className="app">

      <h1>
        Interactive Calendar
      </h1>


      <p className="subtitle">
        Drag events between days, then flip the
        switches below to see, in real time,
        what React.memo, useCallback, and
        useMemo actually do to renders.
      </p>


      {/* CONTROLS */}

      <div className="controls">


        {/* REACT MEMO */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={memoEnabled}
              onChange={(event) =>
                setMemoEnabled(
                  event.target.checked
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
              Skip a card's re-render when
              its own props haven't changed.
            </p>

          </div>

        </div>


        {/* USE CALLBACK */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={callbackEnabled}
              onChange={(event) =>
                setCallbackEnabled(
                  event.target.checked
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
              Keep drag handlers
              referentially stable.
            </p>

          </div>

        </div>


        {/* USE MEMO */}

        <div className="control-item">

          <label className="switch">

            <input
              type="checkbox"
              checked={useMemoEnabled}
              onChange={(event) =>
                setUseMemoEnabled(
                  event.target.checked
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
              Cache filtered events and avoid
              unnecessary calculations.
            </p>

          </div>

        </div>


        {/* LIVE CLOCK */}

        <div className="control-item live-control">

          <label className="switch">

            <input
              type="checkbox"
              checked={liveClock}
              onChange={(event) =>
                setLiveClock(
                  event.target.checked
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
              Ticks every 450ms to simulate
              unrelated state elsewhere in
              the application.
            </p>

          </div>

        </div>


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
                  dropHandler(day)
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
                renderCounts[
                  event.id
                ] || 0;


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
                    />

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


      {/* Forces parent re-render when clock changes */}

      <span
        style={{
          display: "none"
        }}
      >
        {clock}
        {monitorVersion}
      </span>

    </div>

  );

}


export default App;