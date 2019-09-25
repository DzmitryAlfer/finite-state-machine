class State {

    constructor(name) {
        this._name = name;
        this._transitions = {}
    }

    setTransition(name, state) {
        this._transitions[name] = state;
    }

    isTransitionExists(tranName) {
        return !!this._transitions[tranName];
    }

    getNextStateFromTransition(tranName) {
        return this._transitions[tranName];
    }

    get Name(){
        return this._name;
    }
}

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config){
            throw new Error("config is null");
        }

        this._stateHistory = [];
        this._undoStateHistory = [];

        this._parseConfig(config);
    }

    get _CurrentState(){
        return this._stateHistory[this._stateHistory.length - 1];
    }

    _parseConfig(config) {
        this._states = {};

        Object.keys(config.states).forEach(stateName => {
            this._states[stateName] = new State(stateName);
        });

        Object.keys(this._states).forEach(stateName => {
            const transitionConfig = config.states[stateName].transitions;

            const selectedState = this._states[stateName];

            Object.entries(transitionConfig).forEach(transition => {
                const relatedState = this._states[transition[1]];
                const transitionName = transition[0];

                selectedState.setTransition(transitionName, relatedState);
            });
        });

        this._initalState = this._states[config.initial];
        this.changeState(this._initalState.Name);
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        const currentState = this._CurrentState;
        return currentState.Name;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        const changedState = this._states[state];

        if(!changedState) {
            throw new Error('State does not exist');
        }

        //this._currentState = changedState;

        this._stateHistory.push(changedState);
        this._undoStateHistory = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const nextState = this._CurrentState.getNextStateFromTransition(event);

        if(!nextState) {
            throw new Error('Unknown transition');
        }

        //this._currentState = nextState;

        this._stateHistory.push(nextState);
        this._undoStateHistory = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        //this._currentState = this._initalState;

        this._stateHistory = [this._initalState];
        this._undoStateHistory = [];
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        return Object.values(this._states).reduce((result, state) => {
            if(event) {
                if(state.isTransitionExists(event)) {
                    result.push(state.Name);
                    return result;
                }
            } else {
                result.push(state.Name);
                return result;
            }

            return result;
        }, []);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this._stateHistory.length === 1){
            return false;
        }

        var currentState = this._stateHistory.pop();
        this._undoStateHistory.push(currentState);

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this._undoStateHistory.length === 0){
            return false;
        }

        const nextState = this._undoStateHistory.pop();
        this._stateHistory.push(nextState);

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        const currentState = this._CurrentState;
        this._stateHistory = [currentState];
        this._undoStateHistory = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
