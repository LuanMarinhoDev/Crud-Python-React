import { ReactComponent as GithubIcon } from 'assets/img/github.svg'
import './styles.css'

function Navbar() {
  return (
    <header>
      <nav className="container">
        <div className="activity-nav-content">
          <div className='activities-logo'>
          <img src={require('assets/img/activities.png')} alt="activities Logo" className='logo-data'/>
            <h1 className='name-business'>Atividades
            </h1>
          </div>
          <a href="https://github.com/LuanMarinhoDev">
            <div className="div-contact-container">
              <GithubIcon />
              <p className='activity-contact-link'>/LuanMarinhoDev</p>
            </div>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar