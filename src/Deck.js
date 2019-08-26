import React from 'react'
import {
    View,
    Animated,
    PanResponder,
    Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends React.Component {
    constructor(props){
        super(props)

        const position = new Animated.ValueXY()
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                position.setValue({x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: () => {}
        })
        this.position = position
    } 
    
    getCardStyle() {
        const rotate =  this.position.x.interpolate({
            inputRange: [ -SCREEN_WIDTH * 1.8, 0, SCREEN_WIDTH * 1.8],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
        ...this.position.getLayout(),
        transform: [{rotate}]
    }
    }

    renderCards() {
        return this.props.data.map((item, index) => {
            if(index === 0) {
                return (
                    <Animated.View
                        key = {item.id}
                        style = {this.getCardStyle()}
                        {...this._panResponder.panHandlers }
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }

            return this.props.renderCard(item)
        })
    }
    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}

export default Deck;