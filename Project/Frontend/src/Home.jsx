import { Link } from 'react-router-dom';
import { Typography, Box, Container, Button } from "@mui/material";
import homeImage from "./assets/home.jpg";

function Home() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${homeImage})`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          color: "#ffffff",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#ffffff" }}>
            Welcome to Oaxaca
          </Typography>
          <Typography variant="h5" component="p" sx={{ color: "#ffffff" }} gutterBottom>
            Experience the best of Mexican street food and table service.
          </Typography>
          <Link to="/menu" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" size="large">
              Explore Menu
            </Button>
          </Link>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#000000", padding: "50px 0" }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ color: "#FFFFFF" }}>
            About Our Restaurant
          </Typography>
          <Typography variant="h6" component="p" paragraph align="center" sx={{ color: "#DCDCDC" }}>
            Located in the heart of Oaxaca, we bring you authentic Mexican street food in a warm, family-friendly atmosphere. Our chefs use the freshest ingredients, handpicked from local markets, to prepare traditional dishes that represent the true flavours of Mexico. Whether you&apos;re here for a quick bite or a relaxed dinner with loved ones, we promise an unforgettable dining experience.
          </Typography>
          <Typography variant="h6" component="p" paragraph align="center" sx={{ color: "#DCDCDC" }}>
            From tacos and tamales to mouth-watering salsas, our diverse menu celebrates the rich culinary culture of Oaxaca. Join us and immerse yourself in the vibrant atmosphere, where every meal tells a story and every bite is a step closer to the heart of Mexico.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#000000", padding: "50px 0" }}>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ color: "#FFFFFF" }}>
            The Culture of Oaxaca
          </Typography>
          <Typography variant="h6" component="p" paragraph align="center" sx={{ color: "#DCDCDC" }}>
            Oaxaca is not just a place, it&apos;s a celebration of heritage, colour, and flavour. We are inspired by the local culture and customs, and our restaurant aims to reflect the heart and soul of Oaxaca through its cuisine and ambiance.
          </Typography>
          <Typography variant="h6" component="p" paragraph align="center" sx={{ color: "#DCDCDC" }}>
            Oaxaca&apos;s food culture is built around fresh, simple ingredients, full of bold flavours and rich traditions. Every dish we serve is a tribute to this culture, using time-honoured recipes passed down through generations. We take pride in serving food that not only nourishes but also tells the story of our beautiful city.
          </Typography>
        </Container>
      </Box>
    </>
  );
}

export default Home;
