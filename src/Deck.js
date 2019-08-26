import React from 'react'
import {
    View,
    Animated,
    PanResponder
} from 'react-native'

class Deck extends React.Component {
    constructor(props){
        super(props)

       this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                console.log(gestureState)
            },
            onPanResponderRelease: () => {}
        })
    }
    
    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item)
        })
    }
    render() {
        return (
            <View {...this._panResponder.panHandlers}>
                {this.renderCards()}
            </View>
        )
    }
}

export default Deck;