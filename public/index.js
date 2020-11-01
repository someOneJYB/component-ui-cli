import React from 'react'
import { render } from 'react-dom'

import Comp from '../components/Swiper'

const elRoot = document.getElementById('app');

const renderD = Component => {
    render(
    <Component/>, elRoot
)
};
if(module.hot) {
    renderD(Comp);
}
