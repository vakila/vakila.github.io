---
layout: post
title: "Notes from 'Neural Networks for NLP'"
---

These are my notes from the tutorial "Neural Networks for Natural Language Processing", given by [Yoav Goldberg](https://www.cs.bgu.ac.il/~yoavg/uni/) at the [German Research Center for AI (DFKI)](http://www.dfki.de/lt/) at Saarland University on March 16, 2016. Often, NNs tutorials use examples from the field of image processing, so it was really nice to hear a tutorial focused on linguistic data and analysis. Here's an overview of the most important things I took away from the talk; check out the notes below and the [PDF version of the tutorial](http://u.cs.biu.ac.il/~yogo/nnlp.pdf) for more details.

* **Representing linguistic features** We need to represent our input data as vectors. Two possible representations are:
  * **"one-hot"**: each input (e.g. representing a word in a sentence) is a long, sparse binary vector, with each element representing a linguistic feature (e.g. "word is 'DOG'", "previous word is 'THE'", "part of speech is 'NOUN'", etc.). Under this representation, each feature is independent.
  * **feature embeddings**: each linguistic feature receives its own vector, and these vectors can be combined (e.g. by concatenation or summing) to create a single vector representing the input. This representation is preferred for NNs, because a) feature vectors are now a parameter of the model and can be trained, and b) features interdependence can be captured - similar features will have similar vectors.
* **Recurrent Neural Nets** are pretty cool. They work by maintaining a "memory" over a series of states, such that the output of a given state is determined by the memory of that state, which is determined by the input to that state and the memory of the previous state. This is recursive, but for a finite input sequence, the recursion can be "unrolled" into a finite series of states - akin to rewriting a recursive function as a `for` loop.)
    * **Acceptors** are RNNs where the output of the final state is what matters. They make a prediction based on the entire sequence, e.g. "Given this sentence (word sequence), what is the sentiment?" or "Given this word (letter sequence), what is the Part Of Speech?".
    * **Transducers**, on the other hand, pay attention to the outputs of intermediate states as well. They predict some kind of sequence based on a history, e.g. a language model that generates the next word based on previous words. (Check out [Andrej Karpathy's "The Unreasonable Effectiveness of Recurrent Neural Networks"](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) for some fun examples of this! It's also just an awesome article.)
    * **Deep RNNs** are like multiple RNNs stacked on top of each other, where the output of a given state in a lower layer serves as input to the corresponding state in the next layer up.
    * A **Bidirectional RNN** is an RNN being run in both directions simultaneously. You could also think of this as two RNNs where the states of one are the "past" (..., *i*-2, *i*-1) and those of the other are the "future" (*i*+1, *i*+2, ...). The outputs of the two are combined to give a prediction that takes into account the context in both directions. This is useful for e.g. capturing an infinite window around a given word, that takes into account the entire linguistic context (not just the history).
    * **Deep, Bidirectional RNNs** also exist. That's where you have a stack of RNNs and they're all running in both directions. Crazy. But apparently these are useful for POS tagging.
    * **Encoder-decoder models**, also called sequence-to-sequence ("seq2seq") models, use two RNNs: an "encoder" which encodes the input sequence into some intermediate representation, and a "decoder" which transduces some output sequence from the encoded representation. These have been used for e.g. machine translation and sentence simplification.


*Disclaimer:* These notes are unedited and only represent my understanding of the material - or possibly my *mis*understanding of it! For more (and more accurate) info, read [Dr. Goldberg's writing](http://u.cs.biu.ac.il/~yogo/nnlp.pdf) instead of mine!

---

## Part 1: Feed-Forward NNs

### Ways to think of NNs

* Modeling non-linear functions (e.g. XOR)
* Learning representations
  * Lower layers learn lower-level representations of the data
  * Image recognition NNs visualize this
  * NLP example: word embeddings - vector representations of word semantics

### Non-linearities

* Main options: Sigmoid, tanh
* Depending on the situation, you might choose either
* He finds that tanh is usually much better to work with
* Other alternatives
  * "Hard tanh"
    * Defined as: 1 if x >= 1, -1 if x <= -1, x otherwise
    * Easier to work with than tanh
  * Rectified Linear Unit (ReLU) - Defined as: max(0,x)

### Output transformations

* Pass output through a "softmax layer"
* Like in a MaxEnt model
* This makes the output positive and sum to 1


### Loss functions

* As in general ML, the idea is to fit a function to minimize some loss
* You have to define a loss function over the output vector and the expected output vector, to quantify the difference between them
* Usual suspects: perceptron, hinge, log-loss (aka cross-entropy loss, requires softmax beforehand)
* Hinge loss example on slides - depends on difference between the predicted score of the true class and the predicted score of the next-highest-scorest class
* Log loss/cross-entropy loss: sum up the product of each label's score times its log

### NLP features for word vectors

* Traditionally, represent the word as a long, sparse binary vector (called "one-hot representation")
* Each binary feature corresponds to a linguistic property (e.g. "word is 'dog'", "previous word is 'the'", "POS is NOUN", etc.)
* Problems with one-hot representation:
  * Must manually define feature combinations (due to linearity)
  * Each feature is independent of the others (e.g. "word is 'dog'" and "word is 'dog' and previous word is 'the'" have nothing to do with one another)
* Better approach for NN modeling: feature embeddings

### Feature embeddings

* Each feature is assigned a vectors
* Input is now a combination of feature vectors, instead of a single vectors
* Feature vectors are parameters of the model, and are trained with the network
* Similar features now receive similar vectors
* To represent a given input, you can combine feature vectors
* you can concatenate the vectors of two words, using the position to indicate which is the current word and which is previous
  * pro: preserve order of features
  * con: encoding more features requires longer vector
* can also sum vectors instead of concatenating them (different feature vectors must be same length)
  * pro: can encode any number of features without the input vector getting longer and longer
  * con: "bag of features" approach, doesn't preserve order
* Continuous Bag of Words (CBOW)
  * basically average the feature vectors
  * popular for document classification
* Features that were represented with indicator functions in a traditional linear model (e.g. word, POS) receive embedding vectors in the NN representation
* Can also embed features that are numeric, by binning them (e.g. sentence length, distance btwn words) and creating a distinct vector for each bin

### Pre-training embeddings

* Pre-training using e.g. `word2vec` and then fine-tuning during NN training (???) will generally help your model be better able to generalize for things it hasn't seen
* Pre-training is largely responsible for the success of NNs in NLP
* How it works:
  * Define auxiliary task that you think is correlated with your prediction problem
  * Train a model to perform this task
  * Take feature representations from the model as inputs to another model
* Example: if your task is predicting a word based on its meaning, an auxiliary task might be predicting a word based on neighboring words (with the reasoning that similar words will have similar neighbors)



### Neural language models

* Take vectors of each word in k-length history
* Concatenate them
* Feed to Multi-Layer Perceptron (MLP)
* Feed through *softmax* function
* Output: probability of the next word, given the k-length history

* Pros:
  * Can use large n-grams
  * Flexible conditioning contexts
* Cons:
  * Gives good improvement in perplexity, but not in BLEU score (metric for Machine Translation)
  * Slow to train because we need *softmax* over the entire vocabulary
* Good at generalization, which is both a pro and con
  * seeing "red car", "blue car", "yellow car" in data and assigning an OK probability to "green car" is good
  * seeing "black horse", "brown horse" and thinking "blue horse" is OK is bad


### Training

* Based on a Computation Graph
* For each training example (or mini-batch):
  * Create graph to compute loss
  * Compute loss (forward)
  * Compute gradients (backwards)
  * Update parameters
    * Different methods for this, simplest is Stochastic Gradient Descent (SGD)

### Software

* Long list of libraries/packages including Theano, Torch, PyCNN, ...
* Code using pyCNN as example (see slides)



## Part 2: The cool stuff (RNNs and LSTMs)

We'll approach these as sort of black-boxes, only concerning ourselves with how to use them (i.e. what is the API?), not how they work under the hood

### Recurrent Neural Networks (RNNs)

* Input sequence: `x_i:x_n`
* Memory: `s` (way of remembering some kind of state at each step in the network processing)
* `RNN(s_0,x_1:x_n) = s_n, y_n`
* At each step, `s_i` is determined based on `x_i` and the previous `s_i-1` by some function *R*
  * `s_i = R(s_i-1, x_i)`
* At each step, `y_i` is determined based on the memory s by some function *O*
  * `y_i = O(s_i)`

* RNNs are recursive
  * `y_3 = O(s_3)`
  * `s_i = R(s_i-1, x_i)`
  * `y_3 = O(R(s_2, x_3))`
  * `y_3 = O(R(R(s_1, x_2), x_3))`
  * `y_3 = O(R(R(R(s_0, x_1), x_2), x_3))`
* But for a finite input sequence, you can "unroll" the recursion into a finite series of steps (like transforming recursive function into iterative one)

* What are these intermediate `y_i` vectors for?
  * On their own they mean nothing
  * But we can train them, e.g. for loss (see below)


### LSTMs and Concurrent Gates

* Main idea between Long Short-Term Memory (LSTM) is that you want to somehow control the way you access your memory,
* We want to selectively read from only some memory "cells" (elements in our `s` vector), and selectively write to only some of them
* The gate function controls access: if the gate function is 0, we don't use that cell
* The LSTM is a specific combination of gates, which determines what/how much to remember
* Gated architecture helps the vanishing gradients problem (see paper by Cho)


### Defining loss in RNNs

* Ignoring intermediate outputs (`y_i`)
  * Called an "Acceptor"
  * Predict something based on final output (`y_n`)
    * e.g. given the sequence of words in a sentence, what is the sentiment?
    * e.g. given the sequence of characters in a word, what is its POS?
  * Calculate the loss based on the expected output
  * Backpropagate the loss to all the previous states
* Using intermediate outputs (`y_i`)
  * Called a "Transducer"
  * Predict something & calculate loss based on each intermediate state/outputs
  * Sum the losses once you reach the end
  * Backpropagate the sum through the previous states


### RNN Language Models

* Training: use Transducer
* Language generation: the output `y_i` at each intermediate state is a prediction of the next word
  * e.g. example of "code" generated from model trained on Linux kernel

### Fancy RNNs

* Bidirectional RNN
  * One RNN runs left to right, another right to left
  * The outputs of the two are concatenated
  * Together they make a sort of infinite window around a given word, encoding both the future and the history of the word

* Deep RNN
  * You can stack RNNs such that the output from one layer (`y_i`) is the input (`x_i`) to the next layer
  * This gives you a sort of grid of states, where the output of a given state in a given layer is dependent on the memory of that layer and the output of the corresponding state in the lower layer
  * "Adding more layers helps"

* Deep Bidirectional RNN
  * What you think it is - a combination of the two
  * Each layer of the deep RNN is running in both directions
  * Useful for e.g. POS tagging


### Encoder-decoder (seq2seq) models

* One RNN (the encoder RNN) encodes the input, Another (the decoder RNN) transduces something back from the encoded input
* e.g. for sentence simplification:
  * Encode a sentence
  * Decode a sequence of drop/keep decisions
* e.g. for MT:
  * Encode an English sentence
  * Decode into a French sentence
  * See "Sequence to Sequence Learning with Neural Networks" paper by Google folks
* e.g. for automatic email responses
  * Encode an email, decode a short response
  * Used by Google Inbox: see "Computer, respond to this email" on Google Research Blog (Nov 3, 2015)
* e.g. Autoencoder
  * Encode an English sentence, then decode it (basically re-generating the sentence)
  * This may seem useless, but the encoded representation can be seen as a generic representation of the sentence content, which you could use for other things (...?)
  * Some folks are working on deciphering what information is contained in the encoded vector
