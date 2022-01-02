import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import factory from './../ethereum/factory'
import Layout from './../components/Layout'
import { Link } from './../routes'
import web3 from './../ethereum/web3'

class App extends React.Component {
  static async getInitialProps () {
    const compaigns = await factory.methods.getDeployedContracts().call()

    return { compaigns }
  }

  async componentDidMount () {
    const accounts = await web3.eth.getAccounts()
    console.log({ accounts })
  }

  renderCompaignCards () {
    const { compaigns } = this.props
    if (compaigns && compaigns.length) {
      const items = compaigns.map(e => {
        return {
          header: e,
          description: (
            <Link route={`/compaigns/${e}`}>
              <a>View Compaign</a>
            </Link>
          ),
          fluid: true,
          centered: true
        }
      })

      return <Card.Group items={items} />
    } else {
      return <h3>No Compaign Started</h3>
    }
  }

  render () {
    return (
      <Layout>
        <h3>Open Compaigns</h3>
        <Link route='/compaigns/new'>
          <a>
            <Button
              floated='right'
              color='blue'
              icon='add circle'
              content='Add New Compaign'
            />
          </a>
        </Link>
        <div>{this.renderCompaignCards()}</div>
      </Layout>
    )
  }
}

export default App
