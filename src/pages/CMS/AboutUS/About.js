import React from 'react'
import './About.scss'
import { useHistory } from 'react-router-dom';

function About() {
    const history = useHistory()
  return (
    <div className='about'>
        <span className='about__goback' onClick={() => history.goBack()}>
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
        <div className='about__top'>
            <h3 className='about__title'>Our mission</h3>
            <p>
                Our desire to do better and be the best drives the passion and commitment behind everything we do. Therefore it is our passion and commitment to excellence that has established JAGOTA as one of the most creative and innovative companies in Thailand today, bringing trend setting and bespoke food solutions. As a dedicated company, we are constantly evolving with new ideas, concepts, events and solutions that further drive the success of our customers wherever they are and whatever their business, Modern Trade, Food Service, Catering, E-commerce… In this fiercely competitive market, we are constantly learning, from our environment, customer’s needs, market trends… and growing in the process, to consistently delight our customers and live on our promise of delivering
            </p>
            <h4>“Awesome Food Ingredients from around the world”</h4>
        </div>

        <div className='about__middle'>
            <h4>JAGOTA’s strongpoints</h4>
            <ul>
                <li>Experiences</li>
                <p>Our company has started business in food industry for more than 18 years in Thailand and we know how truly important food means in our life, it’s a memories, a connection, a comfort, a sign of love which our mission is to keep bringing and offering the best of food to our customers</p>
                <li>Premium quality and vast selection</li>
                <p>We only aim for high premium ingredients and products for our customers to ensure every customer everywhere has constant access to our vast selection of specialty foods and supplies.</p>
                <li>Services</li>
                <p>We have a high quality control over our own supply chain – safer and better. fully managed service,Trusted food supply chain service provider and able to provide professional consultation to all the customers as a food expert.</p>
                <li>Beyond industrial standard</li>
                <p>We constantly use the Quota Management System (QMS) to help manage fisheries in a sustainable way. Then we also implement the Hazard Analysis and Critical Control Point (HACCP) to make sure of food hygiene and quality for our customers. We are continuously innovating our operations to exceed the industrial standard.</p>
            </ul>
        </div>

        <div className='about__bottom'>
            <h4>Our next big offer - Newly established online platform</h4>
            <p>In order to create an even better customer experience and to be the pioneer of the food solution industry, we established the B2B online platform shop.jagota.com to offer a whole new digital experience to our customers. </p>
            <p>Jagota Online is your one-stop shop for ordering online, tracking your deliveries, paying your bills, and more.</p>
            <p>With Jagota Online you can view a map of your truck’s location, receive real-time status updates for your deliveries, and get an overview of your inbound items all in one place.</p>
            <p>Jagota Online provides you with multiple resources of authentic ingredients, brands and tools from all over the world.</p>
        </div>
    </div>
  )
}

export default About