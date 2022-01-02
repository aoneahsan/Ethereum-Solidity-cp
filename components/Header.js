import React from 'react'
import { Menu, MenuItem } from 'semantic-ui-react'
import { Link } from './../routes'

export default () => {
  return (
    <div style={{ margin: '10px 0 20px 0' }}>
      <Menu>
        <Link route='/'>
          <a className='item'>CrowdCoin</a>
        </Link>
        <Menu.Menu position='right'>
          <Link route='/'>
            <a className='item'>Compaigns</a>
          </Link>
          <Link route='/compaigns/new'>
            <a className='item'>+</a>
          </Link>
        </Menu.Menu>
      </Menu>
    </div>
  )
}
