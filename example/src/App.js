import React, { Component } from 'react'

import Pdf from 'react-pdf-js'

export default class App extends Component {
  render () {
    return (
      <div>
        <Pdf file='test.pdf' />
      </div>
    )
  }
}
