import React,{useState,useEffect} from 'react'
import "./cookie.scss"
import axios from "axios";
import request from "../../../request"
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';

function Cookie() {
	const { t } = useTranslation();
	const history = useHistory()

	const [cookiedata,setCookiedata]=useState([])
	const [idtranslate,setidtranslate]=useState();
	var translateid;
	const translate=()=>{
		translateid=	localStorage.getItem("cookiestranslate")
		console.log("a translate",translateid);
		setidtranslate(translateid)
	}
	

	const getcookieContent = async () =>{
		const temp=idtranslate
	try{
		const cookieData = await axios({
			method: "get",
			url: `${request.getcookiescmsEnglish}${temp}`,
			headers: {
			  Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		  });
		  console.log("Cokkies Data=====>", cookieData.data);
		  setCookiedata(cookieData.data.content)
		  
	}
	catch(e){
		console.log(e);
	}
	}
	useEffect(()=>{
		translate()
	},[translate])
	
	
	useEffect(()=>{
		getcookieContent()	
	
	},[getcookieContent])
  return (
    <div className='cookie'>
		<span className='cookie__goback' onClick={() => history.goBack()}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
                >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
        </span>
		<div dangerouslySetInnerHTML={{__html: cookiedata}} className="cookiesdata"></div>
		
        {/* <h3 className='cookie__title'>{t("Cookie Policy")}</h3>
		<p className='cookie__intro'>{t("Jagota Brothers Trading Co., Ltd. ('us', 'we', or 'our') understand that your privacy is important to you and are committed to being transparent about the technologies it uses. This Cookie Policy ('Cookie Policy') explains how and why cookies ( 'Cookies') may be stored on and accessed from your device when you use or visit any website or app that posts a link to this Policy (collectively, our 'Sites'). Please read this Cookie Policy carefully before using our Site. This Cookie Policy should be read together with our Privacy Policy and our Terms of Use.")}</p>
		<ol className='cookie__list'>
			<li>
				{t("What is a cookie?")}
			</li>
			<p>
				{t("A cookie is a small piece of data that a website asks your browser to store on your computer or mobile device. The cookie allows the website to 'remember' your actions or preferences over time. Most Internet browsers support cookies; however, users can set their browsers to decline certain types of cookies or specific cookies. Further, users can delete cookies at any time.")}
			</p>
			<li>{t("Why do we use cookies?")}</li>
			<p>
				{t("We use cookies to learn how you interact with our content and to improve your experience when visiting our website(s). For example, some cookies remember your language or preferences so that you do not have to repeatedly make these choices when you visit one of our websites. We also use cookies to help us with geolocation tracking in order to present you with the closest Shell station and office locations. Additionally, cookies allow us to serve you specific content, such as videos on our website(s). We may employ the learnings of your behavior on our website(s) to serve you with targeted advertisements on third-party website(s) in an effort to “re-market” our products and services to you.What types of cookies do we use?")}
			</p>
			<li>{t("Type of cookies")}</li>
			<p>
				<table>
					<thead>
						<tr>
							<th>{t("Type of cookies")}</th>
							<th>{t("Functions")}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{t("Strictly Necessary Cookies")}</td>
							<td>
								{t("These cookies are necessary for you to browse and use several features on our website, such as accessing safe space on our website. We use strictly necessary cookies to ensure that our digital services provide its basic functions correctly and perfectly.")}
							</td>
						</tr>
						<tr>
							<td>{t("Performance Cookies")}</td>
							<td>
								{t("We use performance cookies to calculate frequency and pattern of your site visits, such as your most visited page. We use this data to improve website efficiency and user experience")}								
							</td>
						</tr>
						<tr>
							<td>{t("Functional Cookies")}</td>
							<td>
								{t("These cookies help websites to remember you and your selections (e.g., selected language, or region) so that better and proper experience could be served to you. In addition, these cookies are also able to remember changes of text size, font, and other parts of the webpage per your own preference.")}
							</td>
						</tr>
						<tr>
							<td>{t("Targeting Cookies")}</td>
							<td>
								{t("These cookies are used to display ads based on relevant topics that interest you. Moreover, they are used to limit the number of ads seen, and measure performance of our advertising campaigns. Sometimes, we share de-identified data regarding your visiting to our advertising and creative alliances. These alliances may use the data to display ads that may interest you on other sites and develop our advertising campaigns in the future.")}
							</td>
						</tr>
					</tbody>
				</table>
			</p>
			<li>{t("Cookies period")}</li>
			<p>
				{t("Session Cookies are temporary cookies that are used to remember you during the course of your visit to the website, and they expire when you close the web browser.")}
				{t("Persistent Cookies are used to remember your preferences within the website and remain on your desktop or mobile device even after you close your browser or restart your computer. We use these cookies to analyze user behavior to establish visit patterns so that we can improve our website functionality for you and others who visit our website(s). These cookies also allow us to serve you with targeted advertising and measure the effectiveness of our site functionality and advertising.")}
			</p>
			<li>{t("How to control cookies?")}</li>
			<p>
				{t("Most internet browsers allow you to choose whether to accept cookies. If you reject, deleting or blocking cookies may affect your user experience. And without cookies, you may not be able to partially or entirely use features or functions of the website, or use of some functions may be limited. If you do not set your browser to reject cookies, the system will use cookies as explained above when you visit our website. If you wish to delete cookies, or change your mind, you could change your setting on your browser.")}				
				<table>
					<thead>
						<tr>
							<th>{t("Browser")}</th>
							<th>{t("Instruction")}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Chrome</td>
							<td>
								<a href="https://support.google.com/chrome/answer/95647?hl=th">
								https://support.google.com/chrome/answer/95647?hl=th
								</a>
							</td>
						</tr>
						<tr>
							<td>Firefox</td>
							<td>
								<a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer">
								https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer
								</a>
							</td>
						</tr>
						<tr>
							<td>Internet Exploere</td>
							<td>
								<a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies#ie=ie-11">
								https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies#ie=ie-11
								</a>
							</td>
						</tr>
						<tr>
							<td>Microsoft Edge</td>
							<td>
								<a href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy">
								https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy
								</a>
							</td>
						</tr>
						<tr>
							<td>Safari</td>
							<td>
								<a href="https://support.apple.com/en-us/HT201265">
								https://support.apple.com/en-us/HT201265
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</p>
			<li>{t("What happens if there are changes to our privacy policy?")}</li>
			<p>
				{t("Any changes we may make to our privacy policy in the future will be posted on this page and, where appropriate, notified to you by email.")}
			</p>
		</ol> */}
    </div>
  )
}

export default Cookie