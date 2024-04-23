import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import LEFTBAR from './Parts/LeftBar'
import SEARCH from './subParts/shortsearchbar-hp'
import styles from './cssModules/envs.module.scss'
import hompagestyle from './cssModules/homepage.module.scss'
import NANDP from './subParts/notifcationandprofile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export default function Events() {
  const navigate = useNavigate()
  const goToEvent = () => {
    navigate('/openevent')
  }
  return (
    <div className={hompagestyle.mainContainer}>
        <LEFTBAR/>
        <div className={hompagestyle.middleColumn}>
                <SEARCH/>
                <div className={styles.SecondBoxEvents1}>
                  <p className={styles.SecondBoxEventsText}>Environments</p>
                </div>
                <div className={styles.SecondBoxEvents2}>
                <p className={styles.optionsEvents1}> Anytime</p>
                <p className={styles.optionsEvents}> Today</p>
                <p className={styles.optionsEvents}> Tomorrow</p>
                <p className={styles.optionsEvents}> This Week</p>
                <p className={styles.optionsEvents}> This Month</p>
                <p className={styles.optionsEvents}> Select</p>
                </div>
                <div className={styles.SecondBoxEvents3}>
                  <div className={styles.SecondBoxEvents3Col1}>
                    <div className={styles.Eventsevent1} onClick={goToEvent}>
                      <img className={styles.Eventsevent1Img} src='story.png'/>
                      <div className={styles.Eventsevent1Time}>
                          <p className={styles.dayEVTC1Text}>Monday, December, 2023</p>
                      </div>
                      <div className={styles.Eventsevent1TitleDescription}>
                        <p className={styles.ESTTitle}>Fashion Meetup</p>
                        <p className={styles.ESTDescription}>
                        Starts at 9 am Los Angeles tarts at 9 am Los Angelestarts at 9 am Los Angeles tarts at 9 am Los Angelestarts at 9 am Los Angelestarts at 9 am Los Angelestarts at 9 am Los Angeles                          </p>
                      </div>
                      <div className={styles.Eventsevent1InterestedOnes}>
                          <div className={styles.interestedBtn}> <p className={styles.interestedBtnText}> Joined <i class="fa-solid fa-check interest-check"></i></p> </div>
                          <img className={styles.Eventsevent1InterestedFaces1} src='profile-pic.png'/>
                          <img className={styles.Eventsevent1InterestedFaces2} src='profile-pic.png'/>
                          <div className={styles.Eventsevent1InterestedFaces3}> <p className={styles.interestPlus}>9 <i class="fa-solid fa-plus plus-icon"></i></p></div>
                      </div>
                    </div>
                          
                  </div>
                  <div className={styles.SecondBoxEvents3Col1}>
                  <div className={styles.Eventsevent1} onClick={goToEvent}>
                      <img className={styles.Eventsevent1Img} src='story.png'/>
                      <div className={styles.Eventsevent1Time}>
                          <p className={styles.dayEVTC1Text}>Monday, December, 2023</p>
                      </div>
                      <div className={styles.Eventsevent1TitleDescription}>
                        <p className={styles.ESTTitle}>Fashion Meetup</p>
                        <p className={styles.ESTDescription}>
                        Starts at 9 am Los Angeles tarts at 9 am Los Angelestarts at 9 am Los Angeles tarts at 9 am Los Angelestarts at 9 am Los Angelestarts at 9 am Los Angelestarts at 9 am Los Angeles                          </p>
                      </div>
                      <div className={styles.Eventsevent1InterestedOnes}>
                          <div className={styles.interestedBtn}> <p className={styles.interestedBtnText}> Joined <i class="fa-solid fa-check interest-check"></i></p> </div>
                          <img className={styles.Eventsevent1InterestedFaces1} src='profile-pic.png'/>
                          <img className={styles.Eventsevent1InterestedFaces2} src='profile-pic.png'/>
                          <div className={styles.Eventsevent1InterestedFaces3}> <p className={styles.interestPlus}>9 <i class="fa-solid fa-plus plus-icon"></i></p></div>
                      </div>
                    </div>
                            
                  </div>
                </div>


        </div>
        <div className={hompagestyle.thirdcolumn}>
            <NANDP/>
        <div className={styles.rightbarTwoEvents}>
        <p className={styles.rightbarTeventsFeaturesStories}> Environments</p>
          <div className={styles.Environment1}>
            <img className={styles.imageEvent} src='story.png'/>
            <p className={styles.titleEvent}>Arijit Singh Concert</p>
            <div className={styles.bodyEvent}> <p className={styles.eventTime}>December 12, 2023</p>
                <div className={styles.tickEvent}><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
         <div className={styles.Environment1}>
            <img className={styles.imageEvent} src='story.png'/>
            <p className={styles.titleEvent}>Arijit Singh Concert</p>
            <div className={styles.bodyEvent}> <p className={styles.eventTime}>December 12, 2023</p>
                <div className={styles.tickEvent}><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
         <div className={styles.Environment1}>
            <img className={styles.imageEvent} src='story.png'/>
            <p className={styles.titleEvent}>Arijit Singh Concert</p>
            <div className={styles.bodyEvent}> <p className={styles.eventTime}>December 12, 2023</p>
                <div className={styles.tickEvent}><i class="fa-solid fa-check tick"></i></div>
            </div>

         </div>
       
         <div className={styles.eventSeeMore}>
            <p className={styles.eventTextSeeMore}>See More <i class="fa-solid fa-greater-than fa-xs"></i></p>
         </div>
        </div>
      </div>
    </div>   
  )
}
