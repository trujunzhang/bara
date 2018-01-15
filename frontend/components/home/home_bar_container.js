import {
  connect
} from 'react-redux';
import {
  demoLogin,
  logout,
} from '../../actions/session_actions';
import HomeBar from './home_bar';

const mapStateToProps = ( {
  currentUser
} ) => ( {
  currentUser
} );

const mapDispatchToProps = dispatch => ( {
  logout: () => dispatch( logout() ),
  demoLogin: () => dispatch( demoLogin() ),
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( HomeBar );