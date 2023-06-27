import "./App.css";
import { createMachine, assign, spawn, sendTo, sendParent } from "xstate";
import { useMachine } from "@xstate/react";

const playerMachine = {
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
};
const player = createMachine(playerMachine);

const slider = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwDYEsJgE4DoByA9gC4AEWYUasR2kAxAEoCiA4gJIDKAKk8wCIBtAAwBdRKAAOBWGiJoCAO3EgAHogCs6gEw4AbABYh6-QA4A7EN1H9ZgDQgAnogDM+9Xt2eTQoyf1bjAF9A+1QMbHxiEgBjRQAzNCgAV3IIOgBVPGZ2bl4mQVFlKRk5RWU1BF1nXRwATl0TXTNnCytjO0cXepwARk8Gn3U-AP1g0PRMXEJSWIUE5NS6AGEAeTwAMTYWdIYAQS42NZJ0gAU+ffzhMSQQYtl5JRuKzR0Da3NLaw6nBBMenHUPiEPWczlqPTMQ2aYxAYUmOAAMgQAIYQNAKKB0BErXZ8S6FG53UqPUAVAC0Wlq+hwQOB2ihJlqlnsP2cQmcOACPhBYIhUJhcIiSNR6MxmWynB4-CuRWk9zKT0QFKpNKBPXp5kZzM6CACOkh3NB4Mh5mcAomQpRaIxyzWm22ewOR1O5x4BWukjlxPKSsp1Np6oCmqZuhZiC0Qh0XOBRr5pvN4VwXAIJAkKGRDjoJwRuwAmiRuLsGG6ZYSvQ8fQgKZZeoY3kGzFrQzr9LUzAC1bGTSYE-Dk6n05nxaxJXl3bKShXFQgelp21pXM5KVoF1UtH8wwhTBzozzjUMeyFYRakym0xnbRstjt9oc8Mczhdx2XJwrSYhZ-PF8vV0uNzr1FBHADRjXlu17CITkHUUsxzfNNjwTgAAl8Q9W5yzfVRfRVAMNUbENN2MExVUNMCDwg3AoIzGDhxyKVUIneUSSwqs-RIukGybTdnEA4DAVA-dzAonAqIcGDVivB1b2dR8SwJT1X2Y8k2NwziCJ1JohBwOstCqMiTEPI8FAITB4BuQUsEY71pzJUxak3MltDqWoXMaKwTC0fRP2E6YyAoKgaFSKyp3fBBnEZbSXNqcL6lMfQWnUbjjE5fi9zjMwfKiWZ5hSSBgswioTFcOpLHVPwbF09Rm1ZVs6gMnohEaSkTEAtthOFa0oHypSlX0LzN1qHQjFIwSzFGI8LJwftzx+BSmMrMlnH+Zo+qMdQ+UbWdEpbMaOxGuND3GRMROgjFuoWvqem4zwcG8faTTG4JgiAA */
  predictableActionArguments: true, // recommended option
  id: "slider",
  // initial: "Not registered",
  initial: "To play",
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

function mul(a, b) {



  return a * b;




}

export default App;
