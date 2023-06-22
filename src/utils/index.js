export const keyExtractor = (_, index) => index?.toString?.() 

export const shuffle = (arr) => {

    let ci = arr.length,  ri;
    while (ci != 0) {
      ri = Math.floor(Math.random() * ci);
      ci--;
      [arr[ci], arr[ri]] = [arr[ri], arr[ci]];
    }

    return arr;
}

export const transitionConfig = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                    },
                ],
            },
        };
    },  
}