export function update(state, subArray, val) {
    if (!subArray) {
        console.log('No target provided');
    } else
    if (subArray.length < 1) {
        console.log('No target provided in update');
    } else
    if (!state) {
        console.log('No state object provided in update');
    } else {
        if (typeof subArray === 'string') {
            subArray = subArray.split('/').filter(segment => segment);
        }
        return reducer(state, subArray, val, 0);
    }
}

function reducer(state, subArray, val, l) {
    try {
        const key = subArray[l];
        if (l + 1 === subArray.length) {
            const replacer = isEmpty(val) ? undefined : val;
            return replacer === undefined ?
                stateWithoutKey(state, key) :
                Object.assign(state, {
                    [key]: replacer
                })
        } else {
            const value = !isEmpty(state[key]) ? state[key] : {};
            return Object.assign(state, {
                [key]: reducer(value, subArray, val, l + 1)
            });
        }
    } catch (error) {
        console.log('reducer error in update =>', error);
    }
}

function isEmpty(val) {
    return val === undefined ||
        val === null
}

function stateWithoutKey(state, removeKey) {
    console.log('called');
    return Object.keys(state).reduce((ac, cv) => {
        return cv === removeKey ? ac : Object.assign({}, ac, {
            [cv]: state[cv]
        })
    }, {});
}
