import React from 'react'
import { Grid, Button } from 'semantic-ui-react'
import Layout from './../components/Layout'

export default class extends React.Component {
  state = {}

  static async getInitialProps (props) {
    const { address } = props.query
    return { address }
  }

  componentDidMount () {}

  render () {
    return (
      <Layout>
        <h3>welcome to name</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Button>ok</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
