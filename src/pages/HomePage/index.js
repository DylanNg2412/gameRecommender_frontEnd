import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  CircularProgress,
  Autocomplete,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState("");
  const [gameOptions, setGameOptions] = useState([]); // Dynamically fetched game options
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch the list of game options from the backend
  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/games");
        if (response.data.games) {
          setGameOptions(response.data.games.map((game) => game.name)); // Extract only game names for Autocomplete
        }
      } catch (error) {
        console.error("Error fetching game options:", error);
        alert("Failed to load game options. Please refresh the page.");
      }
    };
    getGames();
  }, []);

  // Handle recommendations
  const handleRecommend = async () => {
    if (selectedGame) {
      setIsLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:5000/recommend", {
          selectedGame,
        });
        setRecommendations(response.data.recommendations || []);
        setShowRecommendations(true);
      } catch (error) {
        alert("Failed to fetch recommendations. Please try again.");
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please select a game!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          minHeight: "100vh",
          borderRadius: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            // display: "flex",
            // flexDirection: "column",
            minHeight: "100vh",
            p: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Game Recommendation System
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign={{ xs: "left", md: "right" }}>
                <FormControlLabel
                  control={
                    <Switch checked={darkMode} onChange={toggleDarkMode} />
                  }
                  label={darkMode ? "Dark Mode" : "Light Mode"}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Search for a game:
            </Typography>

            <Autocomplete
              options={gameOptions}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Game Name"
                  variant="outlined"
                  fullWidth
                />
              )}
              onInputChange={(event, newValue) => {
                setSelectedGame(newValue);
                setShowRecommendations(false);
              }}
            />

            <Button
              variant="contained"
              color="error"
              disabled={!selectedGame}
              onClick={handleRecommend}
              sx={{
                marginTop: 2,
                // width: "100%",
                fontWeight: "Bold",
              }}
            >
              Recommend
            </Button>

            {isLoading && (
              <Box mt={4} textAlign="center">
                <CircularProgress />
                <Typography>Finding the best games for you...</Typography>
              </Box>
            )}

            {showRecommendations &&
              !isLoading &&
              recommendations.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Recommended Games:
                  </Typography>
                  <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{ maxHeight: 500, overflow: "auto" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Release Date</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Tags</TableCell>
                          <TableCell>Genres</TableCell>
                          <TableCell>Popularity</TableCell>
                          <TableCell>Reviews</TableCell>
                          <TableCell>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recommendations.map((game, index) => (
                          <TableRow key={index}>
                            <TableCell>{game.name || "N/A"}</TableCell>
                            <TableCell>
                              {game.release_date || "Unknown"}
                            </TableCell>
                            <TableCell>{game.price || "N/A"}</TableCell>
                            <TableCell>{game.tags || "N/A"}</TableCell>
                            <TableCell>{game.genres || "N/A"}</TableCell>
                            <TableCell>{game.popularity || "N/A"}</TableCell>
                            <TableCell>{game.reviews || "N/A"}</TableCell>
                            <TableCell>
                              {game.score ? `${game.score}%` : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

            {showRecommendations &&
              !isLoading &&
              recommendations.length === 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    No recommendations found.
                  </Typography>
                </Box>
              )}
          </Container>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
