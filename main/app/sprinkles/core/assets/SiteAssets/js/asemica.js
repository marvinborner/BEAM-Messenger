function asemica(Text, CorpusUrl, Intent = "enc") {
    let CorpusString, Tokens, Transitions;

    fetch(CorpusUrl)
        .then(function (response) {
            response.text().then(function (response) {
                CorpusString = response;
                Tokens = TokenizeCorpus(CorpusString);
                Transitions = GenerateTransitions(Tokens);
                if (!VerifyExists(Transitions)) {
                    throw new Error("Please choose another text.");
                } else {
                    console.log(Encode("LOL", Transitions, Tokens));
                }
            });
        });


    /**
     * Encodes an input file using the transition matrix calculated from the corpus
     *
     * @return {string}
     */
    function Encode(Input, Transitions, Tokens) {
        var Nibbles = [4, 4, 3, 2, 15, 2, 3, 2, 4, 4, 0, 4, 5, 0]; // TODO: Support other words than "LOL"
        var Token = Tokens[Math.round(Math.random() * (Tokens.length - 1) + 1)];
        var EncodedText = "";

        while (Nibbles.length) {
            if ("meaningful" in Transitions[Token.toLowerCase()]) { // Token is meaningful
                EncodedText += Token + " ";

                var Nibble = Nibbles.shift();
                Token = Transitions[Token.toLowerCase()]["door"][Nibble];
            } else { // Token is irrelevant -> go through random door
                EncodedText += Token + " ";

                var RandomDoorNumber = Math.round(Math.random() * (Transitions[Token.toLowerCase()]["doors"] - 1) + 1); // Fix for a annoying bug (count from 1 but array is 0)
                if (RandomDoorNumber === 1 || RandomDoorNumber === Transitions[Token.toLowerCase()]["doors"]) RandomDoorNumber--;
                Token = Transitions[Token.toLowerCase()]["door"][RandomDoorNumber];
            }

            if (Token === undefined) throw new Error("Token is undefined, please report this error to the developer.");
        }

        EncodedText += Token + "";
        return EncodedText;
    }

    /*
    * Breaks the input corpus into a series of processable "tokens"
    *
    * Example output: ['The','Project','Gutenberg', ... ,'about','new','eBooks']
    */
    function TokenizeCorpus(CorpusString) {
        // Clean up things
        const StrippedCorpus = CorpusString
            .replace(/\n/g, " ") // newlines
            .replace(/<\/?[^>]+(>|$)/g, "") // html
            .replace(/[^\w']/g, " ") // non-word characters
            .replace(/[0-9]/g, " ") // numbers
            .replace(/\s\s+/g, " ") // sequences of spaces
            .replace(/^\s+/, "") // leading whitespace
            .replace(/\s+$/, ""); // trailing whitespace

        Tokens = StrippedCorpus.split(/\s/);

        return Tokens;
    }

    /*
    * Creates the primary transition matrix
    *
    * Example output:
    *
   	* 'atlantic' => {                       // Lowercase form
    *           'seen' => 2,                // How many times seen in corpus
    *           'exits' => {                // Which words follow it?
    *                         'City' => 1,  // One instance of this
    *                         'and' => 1    // One instance of that
    *                      },               // Exits not guaranteed unique
    *           'door' => [                 // Doors are guaranteed unique exits
    *                        'City',        // Following door number 1
    *                        'and'          // Following door number 2
    *                     ],
    *           'doors' => 2,               // Cached count of doors
    *           'token' => 'Atlantic'       // Original form of the token
    * }
    * ...
    */
    function GenerateTransitions(Tokens) {
        Transitions = {};

        Tokens.forEach(function (Token, Index) {
            var ObjectKey = Token.toLowerCase();
            if (!(ObjectKey in Transitions)) Transitions[ObjectKey] = {};
            if (!("exits" in Transitions[ObjectKey])) Transitions[ObjectKey]["exits"] = {};

            Transitions[ObjectKey]["seen"] += 1;
            Transitions[ObjectKey]["token"] = ObjectKey;
            if (Tokens[Index + 1] !== undefined) {
                Transitions[ObjectKey]["exits"][Tokens[Index + 1]]++;
            }
        });

        // Calculate the exits and doors
        for (var Transition in Transitions) {
            var Exits = Transitions[Transition]["exits"];
            var Found = {};
            Transitions[Transition]["door"] = [];

            for (var Exit in Exits) {
                if (!(Exit.toLowerCase() in Found)) Transitions[Transition]["door"].push(Exit.toLowerCase());
                Found[Exit.toLowerCase()] = 1;
            }

            Transitions[Transition]["doors"] = Transitions[Transition]["door"].length;
            if (Transitions[Transition]["doors"] > 15) Transitions[Transition]["meaningful"] = 1;
        }

        return Transitions;
    }

    /**
     * Returns whether this corpus will work well as an encoding or decoding medium
     *
     * @return {boolean}
     */
    function VerifyExists(Transitions) {
        var Count = 0;

        for (var Key in Transitions) {
            if (Transitions[Key]["doors"] > 15) {
                Count++;
            }
        }
        return Count >= 7;
    }

}
