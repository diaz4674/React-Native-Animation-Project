import React from 'react'
import {
    View,
    Animated,
    PanResponder,
    Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

class Deck extends React.Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

    constructor(props){
        super(props)

        const position = new Animated.ValueXY()
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                position.setValue({x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {
                if(gestureState.dx > SWIPE_THRESHOLD){
                    this.forceSwipe('right')
                } else if (gestureState.dx < -SWIPE_THRESHOLD){
                    this.forceSwipe('left')
                } else {
                    this.resetPosition()
                }
                
            }
        })
        
        this.position = position
        this.state = { index: 0 }
    } 

    forceSwipe(direction){
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH

        Animated.timing(this.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start( () => this.onSwipeComplete(direction))
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data}  = this.props
        const item = data[this.state.index]

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
        this.position.setValue({x: 0, y: 0})
        this.setState({ index: this.state.index + 1})
    }

    resetPosition(){
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 }
        }).start()
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
        if(this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards()
        }

        return this.props.data.map((item, i) => {
            if( i < this.state.index) {return null}

            if(i === this.state.index) {
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