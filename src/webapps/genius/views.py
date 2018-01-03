# -*- coding: utf-8 -*-


from mimetypes import guess_type
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.db import transaction
from django.http import Http404
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.db.models import Max
# Create your views here.
from django.urls import reverse
from nltk.corpus import wordnet
from .forms import *
from .models import *


def home(request):
    # get the all the posts and order in the reverse of time
    return render(request, 'genius/mainpage.html', {})


@transaction.atomic
def signup(request):
    context = {}

    # Just display the registration form if it is a GET request
    if request.method == 'GET':
        context['form'] = RegistrationForm()
        return render(request, 'genius/signup.html', context)
    post = request.POST
    form = RegistrationForm(request.POST)
    # check the validity of the form
    if not form.is_valid():
        context['form'] = form
        return render(request, 'genius/signup.html', context)

    # Creates the new user from the valid form data
    new_user = User.objects.create_user(username=form.cleaned_data.get('username'),
                                        password=form.cleaned_data.get('password1'),
                                        first_name=form.cleaned_data.get('first_name'),
                                        last_name=form.cleaned_data.get('last_name'),
                                        email=form.cleaned_data.get('email'),
                                        is_active=False)
    new_user.save()

    token = default_token_generator.make_token(new_user)
    email_body = """
    Welcome to the Baby Genius. Please click the link below to verify your email address and complete the registration of  your account:

    http://%s%s
    """ % (request.get_host(), reverse('confirm', args=(new_user.username, token)))

    send_mail(subject="Verify your email address",
              message=email_body,
              from_email="yuhengw@andrew.cmu.edu",
              recipient_list=[new_user.email])

    context['email'] = form.cleaned_data['email']
    return redirect(reverse('email_confirmation'))

def email_confirmation(request):
    return render(request, 'genius/email_confirmation.html', {})


@transaction.atomic
def forget_password(request):
    context = {}
    # Just display the forget password form if it is a GET request
    if request.method == 'GET':
        context['form'] = EmailForm()
        return render(request, 'genius/forget_password.html', context)

    form = EmailForm(request.POST)
    # Validates the form.
    if not form.is_valid():
        context['form'] = form
        return render(request, 'genius/forget_password.html', context)
    try:
        user = User.objects.get(email=form.cleaned_data['email'])
    except ObjectDoesNotExist:
        raise Http404

    token = default_token_generator.make_token(user)

    email_body = """
    Please click the link below to verify your email address
    and complete the password resetting of your account:
    http://%s%s
    """ % (request.get_host(),
           reverse('password_confirm', args=(user.username, token)))

    send_mail(subject="Baby Genius - Verify your email address",
              message=email_body,
              from_email="yuhengw@andrew.cmu.edu",
              recipient_list=[user.email])
    context['form'] = form
    context['email'] = form.cleaned_data['email']
    context['success'] = 'Email sent! Check your email in your mail box!'
    return render(request, 'genius/forget_password.html', context)


@transaction.atomic
def registration_confirmation(request, username, token):
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        raise Http404

    if not default_token_generator.check_token(user, token):
        raise Http404
    # set the state of the user as active so that the user can log in now
    user.is_active = True
    user.save()
    # creat a profile for the user when the registration has been confirmed
    new_profile = Profile(age=0, user=user, bio='')
    new_profile.save()
    login(request, user)
    return redirect(reverse('home'))


@login_required()
def change_password(request):
    context = {}
    # Just display the password form if it is a GET request
    if request.method == 'GET':
        context['form'] = PasswordForm()
        return render(request, 'genius/change_password.html', context)

    form = PasswordForm(request.POST)

    # Validate the form
    if not form.is_valid():
        context['form'] = form
        return render(request, 'genius/change_password.html', context)

    # check the old_password
    old_password = form.cleaned_data.get('password')
    user = authenticate(username=request.user.username, password=old_password)
    if user is None:
        context['error'] = "The old password was incorrect."
        context['form'] = form
        return render(request, 'genius/change_password.html', context)

    # Change the password of the request user
    user = request.user
    user.set_password(form.cleaned_data['password1'])
    user.save()
    login(request, user)
    context['success'] = 'Password changed!'
    context = {'user': request.user, 'form': PasswordForm, 'success': 'Password changed!'}
    return render(request, 'genius/change_password.html', context)


@transaction.atomic
def password_reset_confirmation(request, username, token):
    context = {}
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        raise Http404

    if not default_token_generator.check_token(user, token):
        raise Http404

    context['user'] = user
    context['form'] = ResetForm()
    return render(request, 'genius/reset_password.html', context)


@transaction.atomic
def reset_password(request, username):
    context = {}
    # Just display the reset password form if it is a GET request
    if request.method == 'GET':
        context['form'] = ResetForm()
        return render(request, 'genius/reset_password.html', context)

    form = ResetForm(request.POST)
    context['form'] = form
    # Validates the form.
    if not form.is_valid():
        context['user'] = User.objects.get(username=username)
        return render(request, 'genius/reset_password.html', context)

    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        raise Http404
    user.set_password(form.cleaned_data['password1'])
    user.save()
    login(request, user)
    return redirect(reverse('home'))


@login_required
def editProfile(request):
    context = {}
    try:
        profile = Profile.objects.get(user=request.user)
    except ObjectDoesNotExist:
        raise Http404
    # Just display the edit profile form if it is a GET request
    if request.method == 'GET':
        context['form'] = EditFrom()
        context['profile'] = profile
        return render(request, 'genius/edit_profile.html', context)

    form = EditFrom(request.POST, request.FILES)
    context['form'] = form
    # Validate the form
    if not form.is_valid():
        context['form'] = form
        context['profile'] = profile
        return render(request, 'genius/edit_profile.html', context)

    profile.age = form.cleaned_data['age']
    profile.bio = form.cleaned_data['bio']
    # if the profile image has been changed
    if form.files.has_key('picture'):
        profile.picture = form.files.get('picture')
    user = request.user
    user.first_name = form.cleaned_data['first_name']
    user.last_name = form.cleaned_data['last_name']
    profile.save()
    request.user.save()
    context['profile'] = profile
    context['success'] = 'Profile saved!'
    return render(request, 'genius/edit_profile.html', context)

#This function is used for the admin to upload the image for the game animal match up.
def upload_image_matching(request):
    context={}
    #just display the form when it is a get request
    if request.method=='GET':
        context['form'] = ImageForm()
        return render(request, 'genius/upload_image_matching.html', context)
    form = ImageForm(request.POST, request.FILES)
    context['form'] = form
    #validate the form
    if not form.is_valid():
        context['form'] = form
        return render(request,'genius/upload_image_matching.html', context)
    image_name = form.cleaned_data['name']
    image_picture = form.files.get('picture')
    image = Image(name=image_name,picture=image_picture)
    image.save()
    context['success'] = 'image uploaded!'
    return render(request, 'genius/upload_image_matching.html', context)

@login_required
def get_photo(request, username):
    # get the photo of the user specified
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        raise Http404
    try:
        profile = Profile.objects.get(user=user)
    except ObjectDoesNotExist:
        raise Http404

    if not profile.picture:
        raise Http404
    content_type = guess_type(profile.picture.name)
    return HttpResponse(profile.picture, content_type=content_type)

@login_required
def get_image_matching_photo(request, id):
    # get the photo of the user specified
    try:
        image = Image.objects.get(pk=id)
    except ObjectDoesNotExist:
        raise Http404

    #raize a 404 error if picture not found
    if not image.picture:
        raise Http404
    content_type = guess_type(image.picture.name)
    return HttpResponse(image.picture, content_type=content_type)

def display_game(request):
    return render(request, 'genius/display_game.html', {})

@login_required()
def math_game(request):
    context = {}
    #get the most recent 3 scores of the request user
    scores = AddSubstractionScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['game_name'] = 'Fruit + or -'
    return render(request, 'genius/math_game.html', context)

@login_required()
def image_matching_game(request):
    context = {}
    # get the most recent 3 scores of the request user
    scores = ImageMatchingScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['game_name'] = 'Animal Match Up'
    return render(request, 'genius/image_matching_game.html', context)

@login_required()
def play_math_game(request):
    context = {}
    form = DifficultyForm(request.POST)
    #validate the form
    if not form.is_valid():
        return
    difficulty = form.cleaned_data['difficulty']
    questions = Question.objects.all()
    #randomly select the questions of the difficulty level from the question bank
    game_questions = questions.filter(difficulty=difficulty).order_by('?')[:10]
    game = mathGame(user=request.user, score=0)
    game.save()
    #add the questions to a game to form a many-to-many relationship
    for game_question in game_questions:
        game.questions.add(game_question)
    game.save()
    # get the most recent 3 scores of the request user
    scores = AddSubstractionScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    #load the first question
    context['question'] = game.questions.all()[0]
    context['game_id'] = game.game_id
    context['game_name'] = 'Fruit + or -'
    return render(request, 'genius/play_math_game.html', context)

@login_required()
def play_image_matching(request):
    #randomly select 9 images
    nine = Image.objects.all().order_by("?")[:9]
    pk_list = []
    for i in nine:
        pk_list.append(i.pk)
    #shuffle the name list
    names = Image.objects.filter(pk__in=pk_list).order_by("?")
    #shuffle the image list
    images = list(Image.objects.filter(pk__in=pk_list).order_by("?"))
    image1 = images[0:3]
    image2 = images[3:6]
    image3 = images[6:10]
    context={}
    # get the most recent 3 scores of the request user
    scores = ImageMatchingScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['names'] = names
    context['image1'] = image1
    context['image2'] = image2
    context['image3'] = image3
    context['game_name'] = 'Animal Match Up'
    return render(request, 'genius/play_image_matching.html', context)

@login_required()
def get_question(request, game_id, count, choice=''):
    context = {}
    #get the question list of the specified game id
    questions = list(Question.objects.filter(mathgame__game_id=int(game_id)))
    if len(questions) != 10 or int(count) - 2 > 9:
        raise Http404
    #get the next question
    question = questions[int(count) - 2]
    #check the correctness
    if question.answer == choice:
        context['result'] = 'correct'
        game = mathGame.objects.get(game_id=game_id)
        #update the score
        game.score += 10
        game.save()
    else:
        context['result'] = 'wrong'
    context['question'] = questions[int(count) - 1]
    return render(request, 'genius/question.json', context, content_type='application/json')

@login_required()
def math_game_end(request, game_id, count, choice=''):
    questions = list(Question.objects.filter(mathgame__game_id=int(game_id)))
    if len(questions) != 10 or int(count) - 2 > 9:
        raise Http404
    context = {}
    question = questions[int(count) - 2]
    #check the correctness of the last question
    if question.answer == choice:
        context['result'] = 'correct'
        game = mathGame.objects.get(game_id=game_id)
        #update the score
        game.score += 10
        game.save()
    else:
        context['result'] = 'wrong'
    context['profile'] = Profile.objects.get(user=request.user)
    game = mathGame.objects.get(game_id=game_id)
    #save the score
    score = AddSubstractionScore(score=game.score, user=request.user)
    score.save()
    context['finalscore'] = game.score
    # get the most recent 3 scores of the request user
    scores = AddSubstractionScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['fullscore']=100
    context['game_name'] = 'Fruit + or -'
    return render(request, 'genius/math_game_end.html', context)

@login_required()
def matching_game_end(request):
    context={}
    count=0
    posts = request.POST
    #check if the label match the image
    for post in posts:
        s = post.split("-")
        if len(s) == 2:
            key = s[0]
            value = posts[post]
            answer = Image.objects.get(pk=key).name
            if value == answer:
                count+=10
    #save the score
    score=ImageMatchingScore(score=count,user=request.user)
    score.save()
    context['finalscore'] = count
    # get the most recent 3 scores of the request user
    scores = ImageMatchingScore.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['fullscore'] = 90
    context['game_name'] = 'Animal Match Up'
    return render(request,'genius/match_game_end.html', context)

@login_required()
def scoreboard(request,game_name):
    context = {}
    context['profile'] = Profile.objects.get(user=request.user)
    # get the most recent 3 scores of the request user
    if game_name == 'Fruit + or -':
        scores = AddSubstractionScore.objects.filter(user=request.user).order_by('-date', '-time')[:3]
        scoreboard = AddSubstractionScore.objects.all().values('user__username').annotate(
            highestscore=Max('score')).order_by('-highestscore')
    else:
        if game_name == 'Word Snake':
            scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')[:3]
            scoreboard = wordSnakeGame.objects.all().values('user__username').annotate(
                highestscore=Max('score')).order_by('-highestscore')
        else:
            scores = ImageMatchingScore.objects.filter(user=request.user).order_by('-date', '-time')[:3]
            scoreboard = ImageMatchingScore.objects.all().values('user__username').annotate(
                highestscore=Max('score')).order_by('-highestscore')
    #rank highestscore of each user
    rank = 1
    previous = None
    entries = list(scoreboard)
    if scoreboard.count() > 0:
        previous = entries[0]
        previous['rank'] = 1
        for i, entry in enumerate(entries[1:]):
            if entry['highestscore'] != previous['highestscore']:
                rank = i + 2
                entry['rank'] = str(rank)
            else:
                entry['rank'] = str(rank)
                previous['rank'] = entry['rank']
            previous = entry
    context['scores'] = scores
    context['scoreboard'] = entries
    context['game_name'] = game_name
    return render(request, 'genius/scoreboard.html', context)


@login_required()
def my_page(request,game_name):
    context = {}
    # get the most recent 3 scores of the request user and highest top 10 scores
    if game_name == 'Fruit + or -':
        scores = AddSubstractionScore.objects.filter(user=request.user).order_by('-date', '-time')
        history = AddSubstractionScore.objects.filter(user=request.user).order_by('-score')[:10]
    else:
        if game_name == 'Word Snake':
            scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')
            history = wordSnakeGame.objects.filter(user=request.user).order_by('-score')[:10]
        else:
            scores = ImageMatchingScore.objects.filter(user=request.user).order_by('-date', '-time')
            history = ImageMatchingScore.objects.filter(user=request.user).order_by('-score')[:10]
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['history'] = history
    context['game_name'] = game_name
    return render(request, 'genius/MyPage.html', context)

def model_form_upload(request):
    if request.method == 'POST':

        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = DocumentForm()
    return render(request, 'genius/model_form_upload.html', {
        'form': form
    })


def export_auto_doc(request, document_id):
    file_object = Book.objects.all().get(id=document_id)
    filename = os.getcwd() + file_object.document.url
    print os.getcwd()

    try:
        with open(filename, 'r') as pdf:
            response = HttpResponse(pdf.read(), content_type='application/pdf')
            response['Content-Disposition'] = 'inline;filename=' + filename + '.pdf'
            return response
        pdf.closed
    except ValueError as e:
        HttpResponse(e.message)


def sort_by_category(request, category_name):
    try:
        if category_name == 'All':
            book_list = Book.objects.all()
        else:
            book_list = Book.objects.filter(category=category_name)  # contains

    except Book.DoesNotExist:
        raise Http404
    return render(request, 'genius/reading_sort.html', {'book_list': book_list})


def sort_by_level(request, level_name):
    try:
        if level_name == 'All':
            book_list = Book.objects.all()
        else:
            book_list = Book.objects.filter(level=level_name)  # contains

    except Book.DoesNotExist:
        raise Http404
    return render(request, 'genius/reading_sort.html', {'book_list': book_list})


def get_book_info(request, book_id):
    context = {}
    book_object = Book.objects.all().get(id=book_id)
    books_recommend = Book.objects.all().filter(category=book_object.category)
    books_series = Book.objects.all().filter(level=book_object.level)
    context['books_recommend'] = books_recommend
    context['book_info'] = book_object
    context['books_series'] = books_series
    return render(request, 'genius/book_homepage.html', context)


def get_book_display(request, book_id):
    context = {}
    book_object = Book.objects.all().get(id=book_id)
    books_recommend = Book.objects.all().filter(category=book_object.category)
    books_series = Book.objects.all().filter(level=book_object.level)
    context['books_recommend'] = books_recommend
    context['book_info'] = book_object
    context['books_series'] = books_series
    return render(request, 'genius/book_homepage.html', context)


def reading_home(request):
    if not request.method == "GET":
        raise Http404

    if request.method == "GET":
        books = Book.objects.all().order_by('-uploaded_at')
        context = {'books': books}
        return render(request, 'genius/reading_homepage.html', context)


def video_home(request):
    print("Enter video home")
    if not request.method == "GET":
        raise Http404
    if request.method == "GET":
        return render(request, 'genius/video_homepage.html', {'exe': False})


def video_auto(request, tag_name):
    print("HERE")
    print(tag_name)
    return render(request, 'genius/video_homepage.html', {'exe': True, 'tagName': tag_name})

@login_required
def wordsnake(request):
    context = {}
    scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['game_name'] = 'Word Snake'
    return render(request, 'genius/wordSnake.html', context)


@login_required
def receiveScore(request):
    if request.method == 'GET':
        context = {}
        ## access you data by playing around with the request.GET object
        score = request.GET.get('score')
        words= request.GET.get('words')

        new_snakeGame = wordSnakeGame(user=request.user, score=score)
        new_snakeGame.save()
        context['finalscore'] = score
        str_word=str(words)
        output = str_word.split('\n')
        for i in output:
            outputLine=i.strip().split(' ')

            str_getword=str(outputLine[0].strip())
            # print str_getword
            syns = wordnet.synsets(str_getword)
            # print len(syns)
            if(len(syns)>0 and not wordCompleteReview.objects.filter(words=str_getword).exists()):
                word_definition=str(syns[0].definition())
                new_word = wordCompleteReview(user=request.user,words=str_getword, definition=word_definition);
                new_word.save()
                print str_getword
                context['word']=str_getword
                context['definition']=word_definition
                # print(score)
        # syns = wordnet.synsets(str(words))
        # print(syns[0].name())
        # print(syns[0].definition())
        # return render(request, 'genius/wordSnake_end.html', context)
        # return redirect(reverse('wordsnake_end'),context)
        return redirect(reverse('home'))

@login_required
def word_snake_end(request, score):
    print "here"
    context={}
    context['finalscore']=score
    context['game_name'] = 'Word Snake'
    return render(request, 'genius/wordSnake_end.html', context)

@login_required
def review_words(request):
    all_words=wordCompleteReview.objects.filter(user=request.user).distinct()
    context={}
    scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['word']=all_words
    context['game_name'] = 'Word Snake'
    return render(request, 'genius/wordSnake_review.html', context)

@login_required
def wordsnake_game(request):
    context = {}
    scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['game_name'] = 'Word Snake'
    return render(request, 'genius/wordSnake.html', context)

@login_required
def wordsnake_start(request):
    context = {}
    scores = wordSnakeGame.objects.filter(user=request.user).order_by('-date', '-time')
    if scores.count() > 3:
        scores = scores[0:3]
    context['scores'] = scores
    context['profile'] = Profile.objects.get(user=request.user)
    context['game_name'] = 'Word Snake'
    return render(request, 'genius/wordsnake_mainpage.html', context)
