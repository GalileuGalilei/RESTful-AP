const express = require('express');
const app = express();
const PORT = 8080;
var fs = require('fs');
app.use(express.static('scoreboard.json'));

app.use(express.json());

app.listen(PORT, () => 
{
    console.log(`Server running on port ${PORT}`);
});

app.get('/score', (req, res) => 
{
    res.status(200).send(
        {
            score: 100
        }
    );
})

app.post('/score/:player', (req, res) => 
{
    const {player} = req.params;
    const {score} = req.body;

    if(!score)
    {
        res.status(400).send(
            {
                message: 'Invalid score'
            }
        );
    }

    var player_str = 
    {
        name: player,
        score: score
    };

    //check if file exists
    if (!fs.existsSync('scoreboard.json')) 
    {
        fs.writeFileSync('scoreboard.json', '[]');
    }

    var data = fs.readFileSync('scoreboard.json');
    var json = JSON.parse(data);

    //check if name already exists
    for(var i = 0; i < json.length; i++)
    {
        if(json[i].name == player)
        {
            json[i].score = score;
            fs.writeFileSync('scoreboard.json', JSON.stringify(json));
            res.status(201).send(
                {
                    player,
                    score
                }
            );

            return;
        }
    }

    json.push(player_str);
    fs.writeFileSync('scoreboard.json', JSON.stringify(json));

    res.status(200).send(
        {
            player,
            score
        }
    );

})

app.get('/scoreboard', (req, res) => 
{
    var data = fs.readFileSync('scoreboard.json');
    var json = JSON.parse(data);

    res.status(200).send(json);
});