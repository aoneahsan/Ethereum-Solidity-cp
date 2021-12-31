import React from 'react'
import factory from './../ethereum/factory'

class App extends React.Component {
  static async getInitialProps () {
    const compaigns = await factory.methods.getDeployedContracts().call()

    return { compaigns }
  }

  // async componentDidMount () {
  //   const compaigns = await factory.methods.getDeployedContracts().call()

  //   console.log(compaigns)
  // }

  render () {
    console.log(this.props.compaigns)
    return <>working</>
  }
}

export default App
