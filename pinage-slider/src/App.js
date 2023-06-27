import "./App.css";
import { createMachine, assign, spawn, sendTo, sendParent } from "xstate";
import { useMachine } from "@xstate/react";

const player = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcwFsD2AXMA6DAZgQDYCWAdmAMQDqAggNICiA2gAwC6ioADhrKSykM5biAAeiAIwA2AJwAaEAE9pAdgAsuDQFYAzFIBMOgL4mlqTDnzkylKuNhYAhtecEcyABSG2fgJRUlth4InZg7FxIIHwCQiJikgiyiiqIABxSuKZmSuQYEHBiwThisYLCotFJALQySqoIdbkgJaFE4WX8FQnViBqGDdJs6bjpbHLpcjrpenPzGi1tNp3R5fFVoEmGcoa4hpnGQ8lSWXoTUzPzC2ZmQA */
  predictableActionArguments: true, // recommended option
  id: "player",
  initial: "idle",
  context: {
    interval: 5000,
  },
  states: {
    idle: {
      on: {
        "START PLAY": {
          actions: [
            (ctx, evt) => {
              // Getting the custom data included in the event
              console.log("Playing " + evt.asset);
            },
          ],
          target: "playing",
        },
      },
    },
    playing: {
      entry: [
        sendParent({
          type: "PLAY STARTED",
        }),
        () => console.log("Play started"),
      ],
      // FIXME How can I stop playing?
      after: [
        // FIXME Get this interval from context
        {
          delay: (ctx, evt) => ctx.interval,
          target: "idle",
        },
      ],
      exit: [
        sendParent({
          type: "PLAY FINISHED",
        }),
        () => console.log("Play finished"),
      ],
    },
  },
});

const slider = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2BjAhsgdAOVQBcACAJzCgEtZCxyIBiAJQFEBxASQGUAVF1gCIBtAAwBdRKAAOqWJUKVUAO0kgAHogCMIgMwBWHADYALCJMAOEQCY91gOx6ANCACeiHQE4rRw4bubjPTtjTUMPTQBfCOc0LFwCEnRlADNKKABXegYAVTxWTl5+FmFxVRk5BWVVDQRNOo8cD0NzYM1zQz1fTSdXRGNjHRxQv20dOxMzYKiYjGx8ImIkpVSMrIBhAHk8ADEONmymAEEeDi3ibIAFAWPi0QkkEHL5RRUHmtGDCYtrWysHZzctSs5hwthE4OBlnsJmmIFicwAMqhMBBKEooAwERtDgJbqUHk9Kq9QO9zCCPBTKZZ6toeoD9CIcDZwXoAiJOmMHLD4bgkSi0RjcvluHxBHcyrJnlU3loyY1KRTqZpwuyAYgrBScA4WZ1dKYRJFonDZrzkaj0QxNjs9gdjqc8OcrjcSvdpJKidVZeSFR4lSq6erjA1mezfQbQlZjFZuSacDxUMQpMhMC4GBcEYcAJrEXiHJh8F0SiovT0IP6GHDmPQeMZeHQhA0dNUIPT9UHgkT9czGQxWTseGNxOMJpMpnJ5dgioqFgnuksyhCGbRM+uefTmDx2OwiDzNvQ6RkhwKGHT14HGQdzeOJ5Opq27fZHE5nS7XAvi2fF6UkxBLw+rms9A3Lcdz3SwtTBEIBk6XxL1wC5bwFNMM2zXY8G4AAJPFXUeOdv3UL15QVP1aT3DwDA7TszGMbso0MOCcAQlMkKFSdCjFfE3S-YkCNqOUfTDGlVV6BB9Qg8FjDsPs7Bafc9AYpiXCQ+8bSfe1HTfbCiylHjSW9Yjw39Zt-DsHBTBPdkgO6HQWiiI0lFQCA4FUHltI9BcAFpDGbLycEo-zKICBiEjIChqFoeg3PnH8EBabwwXZTRT2BVtvJE0xNCZSCpJEGSHH0YKFiWFZMkgKL8PeHRNFMjwzEjPwaJ3AMEE8CtfXMAJzyCIJJIYvlzSgcrdL6KxmyShp2XBKqktyswByNHlhxvFMhtLQJMqsDpe0sM9fDsPcrEyhL1pEDcPCjBTEPRVaFyjZsQkGKFO2rGjUo6OyIiAA */
  predictableActionArguments: true, // recommended option
  id: "slider",
  initial: "Not registered",
  context: {
    player: null, // Doing spawn(player) here doesn't work
    current: 0,
    assets: [
      "https://images.unsplash.com/photo-1648737966769-98fa88fe66bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80",
      "https://images.unsplash.com/photo-1686080187825-8068e1b1ae1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1655838774838-4a1322530d52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=60",
      "https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
  },
  // Machine level entry action
  entry: [assign({ player: () => spawn(player) })], // Provide interval to use to player
  states: {
    "Not registered": {
      on: {
        REGISTERED: "Not configured",
      },
    },
    "Not configured": {
      on: {
        UNREGISTERED: "Not registered",
        "CONFIGURATION UPDATED": "Loading",
      },
    },
    Loading: {
      on: {
        LOADED: "To play",
        UNREGISTERED: "Not registered",
        "CONFIGURATION UPDATED": "Not configured",
      },
    },
    "To play": {
      entry: [
        sendTo((ctx) => ctx.player, {
          type: "START PLAY",
          asset: (ctx) => ctx.assets[ctx.current], // Passing custom data to the actor
        }),
      ],
      on: {
        "PLAY STARTED": {
          target: "Playing",
        },
        UNREGISTERED: "Not registered", // FIXME Stop the action
        "CONFIGURATION UPDATED": "Not configured", // FIXME Stop the actor
      },
    },
    Playing: {
      on: {
        "PLAY FINISHED": {
          actions: [
            assign({
              current: (ctx) => {
                // Populate the index of the next asset to play
                if (ctx.current + 1 >= ctx.assets.length) {
                  return 0;
                }
                return ctx.current + 1;
              },
            }),
            (ctx) => console.log("222 " + ctx.current),
          ],
          target: "To play",
        },
        UNREGISTERED: "Not registered", // FIXME Stop the action
        "CONFIGURATION UPDATED": "Not configured", // FIXME Stop the action
      },
    },
  },
});

function App() {
  const [state] = useMachine(slider);
  const { current, assets } = state.context;

  return (
    <div className="App">
      <img alt="" width="100%" src={assets[current]} />
    </div>
  );
}

export default App;
