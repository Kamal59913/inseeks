import React from 'react'
import POST from './SubComponent/postHomepage'
import QUESTION from './SubComponent/hpQuestion'
import IMGAGEPOST from './SubComponent/imageHomepage'
import LEFTBAR from './Parts/LeftBar'
export default function Stories() {
  return (
<div className="newContainer">
      <LEFTBAR/>

      <div className='RightbarStories'>
            <div className='rightbar-one-stories'>
                <div className='AccountsInformationTagline-stories'>
                    <i class="fa-solid fa-magnifying-glass stories-glass"></i>
                    <label for="searchbar-stories" className='filters-stories'>FILTERS</label> <br/>
                    <input type="text"
                    name="Occupation"
                    placeholder="Search in Socials..."
                    id="searchbar-stories"/><br/>
                </div>
                <div className='rightbar-one-notification-stories'> <i class="fa-regular fa-bell fa-lg bell"></i> </div>
                <img className='rightbar-one-image-stories' src='profile-pic.png'/>
          </div>
          <div className='rightbar-two-stories'>
            <p className='rightbar-two-features-stories-stories'> Stories </p>
            <div className='rightbar-two-images-array-stories'>
                <p className='options-stories'> For you</p>
                <p className='options-stories'> Following</p>
                <p className='options-stories'> Popular</p>
                <p className='options-stories'> Featured</p>
                <p className='options-stories'> Live</p>
                <p className='options-stories'> Continue Learning</p>
            </div>
          </div>
          <div className='rightbar-stories'>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>  
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
            <div className='rightbar-stories-1'>
                <img src='story.png' className='storyImage'/>
                <img className='User-storie-image' src='profile-pic.png'/>
                <p className='User-storie-name'> boruah_Kamal</p>
            </div>
          </div>

      </div>
      

    </div>    )
}
