// const initialState = {
//   value: 0,
// };

// const incrementInput = document.getElementById("increment");
// const decrementInput = document.getElementsByClassName("decrement");
// const singleResult = document.getElementsByClassName("singleResult");

// const INCREMENT = "increment";
// const DECREMENT = "decrement";

// const increment = (value) => {
//   return { type: INCREMENT, payload: value };
// };

// const decrement = (value) => {
//   return { type: DECREMENT, payload: value };
// };

// function counterReducer(state = initialState, action) {
//   if (action.type === INCREMENT) {
//     return {
//       ...state,
//       value: state.value + action.payload,
//     };
//   } else if (action.type === DECREMENT) {
//     return {
//       ...state,
//       value: state.value - action.payload,
//     };
//   } else {
//     return state;
//   }
// }

// const store = Redux.createStore(counterReducer);

// const render = () => {
//   const state = store.getState();
//   singleResult.innerHTML = state.value.toString();
// };

// render();

// store.subscribe(render);

// const incrementForm = (event) => {
//   if (event.key === "Enter") {
//     const inputElement = document.getElementById("increment");
//     const inputValue = inputElement.value;
//     alert(`The value you entered is: ${inputValue}`);
//   }
// };

// document.addEventListener("keydown", incrementForm);

// // incrementInput.addEventListener("keyup", function (event) {
// //   //   debugger
// //   event.preventDefault();
// //   if (event.key === "Enter") {
// //     event.preventDefault();
// //     const value = parseInt(incrementInput.value);
// //     store.dispatch(increment(value));
// //     alert(value);
// //   }
// // });

const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".addMatch");
const resetBtn = document.querySelector(".reset");

const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset";
const ADD_MATCH = "match/add";
const DELETE_MATCH = "match/delete";

const increment = (payload) => {
  return {
    type: INCREMENT,
    payload,
  };
};

const decrement = (payload) => {
  return {
    type: DECREMENT,
    payload,
  };
};

const reset = () => {
  return {
    type: RESET,
  };
};

const addMatch = () => {
  return { type: ADD_MATCH };
};

const deleteMatch = (matchId) => {
  return { type: DELETE_MATCH, payload: matchId };
};


const initialState = [
  {
    id: 1,
    score: 0,
  },
];


const nextMatchId = (matches) => {
  const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
  return maxId + 1;
};


function matchReducer(state = initialState, action) {
  if (action.type === INCREMENT) {
    const newMatches = state.map((item) => {
      if (item.id === action.payload.id) {
        return { ...item, score: item.score + Number(action.payload.value) };
      } else {
        return item;
      }
    });

    return newMatches;
    
  } else if (action.type === DECREMENT) {
    const newMatches = state.map((item) => {
      if (item.id === action.payload.id) {
        const newScore = item.score - Number(action.payload.value);
        return { ...item, score: newScore > 0 ? newScore : 0 };
      } else {
        return item;
      }
    });

    return newMatches;
  } else if (action.type === RESET) {
    const refreshedMatches = state.map((item) => ({ ...item, score: 0 }));
  } else if (action.type === ADD_MATCH) {
    const id = nextMatchId(state);
    return [...state, { id, score: 0 }];
  } else if (action.type === DELETE_MATCH) {
    const newMatches = state.filter((match) => match.id !== action.payload);
    return newMatches;
  } else {
    return state;
  }
}

const store = Redux.createStore(matchReducer);

const incrementHandler = (id, formEl) => {
  debugger
  const input = formEl.querySelector(".incrementInput");

  const value = Number(input.value);

  if (value > 0) {
    store.dispatch(increment({ id, value }));
  }
};

const decrementHandler = (id, formEl) => {
  const input = formEl.querySelector(".decrementInput");

  const value = Number(input.value);

  if (value > 0) {
    store.dispatch(increment({ id, value }));
  }
};

const handleMatchDelete = (matchId) => {
  store.dispatch(deleteMatch(matchId));
};

addMatchBtn.addEventListener("click", () => {
  store.dispatch(addMatch());
});

resetBtn.addEventListener("click", () => {
  store.dispatch(reset());
});

const render = () => {
  const state = store.getState();
  const matchesView = state.map((item) => {
    return `
    <div class="wrapper">
      <button class="delete" onclick="handleMatchDelete(${item.id})">
          <img src="./image/delete.svg" alt="" />
      </button>
      <h3 class="matchName">Match ${item.id}</h3>
    </div>
    <div class="inc-dec">
      <form class="incrementForm" onsubmit="event.preventDefault();incrementHandler(${item.id}, this)">
          <h4>Increment</h4>
          <input
              type="number"
              name="increment"
              class="incrementInput"
              
          />
      </form>
      <form class="decrementForm" onsubmit="event.preventDefault();decrementHandler(${item.id}, this)">
          <h4>Decrement</h4>
          <input
              type="number"
              name="decrement"
              class="decrementInput"
              
          />
      </form>
      </div>
      <div class="numbers">
          <h2 class="singleResult">${item.score}</h2>
      </div>
  </div>`;
  }).join("");
  matchContainer.innerHTML = matchesView;
};


render();