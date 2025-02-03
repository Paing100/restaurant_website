import { Card, CardActionArea, CardContent, Typography, CardMedia} from "@mui/material";

function MenuCard({item}) {
  return (<>
          <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.img} 
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                      Price: {item.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Calories: {item.calories} kcal
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Allergies: {item.allergies.join(", ")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

          </>
  );
}

export default MenuCard;``