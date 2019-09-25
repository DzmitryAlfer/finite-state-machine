class State {

    constructor(name) {
        this._name = name;
        this._transitions = {}
    }

    setTransition(name, state) {
        this._transitions[name] = state;
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

        this._parseConfig(config);
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

        this._currentState = this._states[config.initial];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._currentState.Name;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this._currentState = this._states[state];

        if(!this._currentState) {
            throw new Error('State does not exist');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {}

    /**
     * Resets FSM state to initial.
     */
    reset() {}

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {}

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {}

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {}

    /**
     * Clears transition history
     */
    clearHistory() {}
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
