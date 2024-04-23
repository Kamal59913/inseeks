import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faHouse, faSeedling, faEnvelope, faUser, faGear, faBackward } from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.scss';

export default function LeftBar() {
  return (
    <div className={styles.SideBar}>
        <Link to="/"><FontAwesomeIcon icon={faSliders} className={styles.SideBarOne} /></Link>
        <Link to="/"><FontAwesomeIcon icon={faHouse} className={styles.SideBarTwo}/></Link>
        <Link to="/environments"><FontAwesomeIcon icon={faSeedling} className={styles.SideBarThree}/></Link>
        <Link to="/messages"><FontAwesomeIcon icon={faEnvelope}  className={styles.SideBarFour}/></Link>
        <Link to="/myprofile"><FontAwesomeIcon icon={faUser}  className={styles.SideBarFive}/></Link>
        <Link to="/profilesettings"><FontAwesomeIcon icon={faGear}  className={styles.SideBarSix}/></Link>
        <Link to="/"><FontAwesomeIcon icon={faBackward}  className={styles.SideBarSeven}/></Link>
    </div>
  );
}
