import React, { Component } from 'react'
import './index.less'
class Swiper extends Component {
    constructor(props) {
        super(props)
        this.state ={
            translate: 0,
        }
        this.line = 100

    }

    componentDidMount() {
        this.line = 100
    }


    touchStart = (e) => {
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
    }

    dealColTranslate = (r) => {
        const { translate } = this.state
        const { onTouchEnd } = this.props
        if(r === 'Down' && !translate) return
        let l = Math.abs(this.startY - this.endY);
        if(r === 'Up')  {
            let v = (l/this.line).toFixed(1)*1+translate
            v = v >= 1 ? 0.9 : v;
            this.setState({
                translate: v,
            })
        }else {
            let v = translate - l/this.line
            v  =  v < 0  ?  0 : v.toFixed(1)*1
            this.setState({
                translate: v,
            }, () =>{
                onTouchEnd && onTouchEnd()
            })
        }
    }

    dealRowTranslate = (r) => {
        const { translate } = this.state
        const { onTouchEnd } = this.props
        console.log(r)
        if(r === 'Left' || r === 'Right') {
            if(r === 'Left' && !translate) return
            let l = Math.abs(this.startX - this.endX);
            if(r === 'Right')  {
                let v = (l/this.line).toFixed(1)*1+translate
                v = v >= 1 ? 0.9 : v;
                this.setState({
                    translate: v,
                })
            }else {
                let v = translate - l/this.line
                v  =  v < 0  ?  0 : v.toFixed(1)*1
                this.setState({
                    translate: v,
                }, () =>{
                    onTouchEnd && onTouchEnd()
                })
            }
        }
    }

    onEnd = (e) => {
        const { direction = 'row' } = this.props
        this.endX = e.changedTouches[0].pageX;
        this.endY = e.changedTouches[0].pageY;
        const r = this.swipeDirection(this.startX, this.endX, this.startY, this.endY);
        if(direction === 'row') {
            // if(r === 'Left' || r === 'Right') {
            //     if(r === 'Left' && !translate) return
            //     let l = Math.abs(this.startX - this.endX);
            //     if(r === 'Right')  {
            //         let v = (l/this.line).toFixed(1)*1+translate
            //         v = v >= 1 ? 0.9 : v;
            //         console.log(v)
            //         this.setState({
            //             translate: v,
            //         })
            //     }else {
            //         let v = translate - l/this.line
            //         v  =  v < 0  ?  0 : v.toFixed(1)*1
            //         this.setState({
            //             translate: v,
            //         }, () =>{
            //             onTouchEnd && onTouchEnd()
            //         })
            //     }
            // }
            return this.dealRowTranslate(r)
        }
        this.dealColTranslate(r);

    }

    swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');

    }

    handleDragEnter = e => {
        console.log(e,'handleDragEnter')
        e.preventDefault();
        // e.stopPropagation();
    };

    handleDragLeave = e => {
        console.log(e,'handleDragLeave')
        e.preventDefault();
        // e.stopPropagation();
    };

    handleDragOver = e => {
        e.preventDefault();
        // e.stopPropagation();
        console.log(e,'handleDragOver')
    };

    handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        console.log(e,'handleDrop')
    };

    renderLine = () => {
        const { translate } = this.state;
        const { direction = 'row' } = this.props
        const isCol = direction === 'col'
        const s = { transform:  isCol ? `translate(-50%, -${translate*this.line}px)` : `translate(${translate*this.line}px, -50%)`}
        if(isCol) {
            return <div className="drag-line col" onTouchStart={this.touchStart} onTouchEnd={this.onEnd}>
                <div className="line-color line-col" style={{ height: `${translate*this.line+5}px` }}></div>
                <div className="bag bag-col" style={s}></div>
            </div>
        }

        return <div className="drag-line" onTouchStart={this.touchStart} onTouchEnd={this.onEnd}>
            <div className="line-color" style={{ width: `${translate*this.line+5}px` }}></div>
            <div className="bag bag-row" style={s}></div>
        </div>
    }

    render() {
        return (
           this.renderLine()
        )
    }
}

export default Swiper
