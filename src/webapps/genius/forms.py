from django import forms
from django.contrib.auth.models import User
from django.core.validators import *
from .models import *


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=20)
    email = forms.EmailField(max_length=254, required = True)
    first_name = forms.CharField(max_length=20, required=False)
    last_name = forms.CharField(max_length=20, required=False)
    password1 = forms.CharField(max_length=200,
                                label='Password',
                                widget=forms.PasswordInput())
    password2 = forms.CharField(max_length=200,
                                label='Confirm password',
                                widget=forms.PasswordInput())

    def clean(self):
        cleaned_data = super(RegistrationForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Password does not match.")

        return cleaned_data

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username):
            raise forms.ValidationError("Username" + username + " is already taken.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email):
            raise forms.ValidationError("Email" + email + " is already registered.")
        return email


class EmailForm(forms.Form):
    email = forms.EmailField(max_length=254, required = True)

    def clean(self):
        cleaned_data = super(EmailForm, self).clean()
        email = self.cleaned_data.get('email')
        if not User.objects.filter(email=email):
            raise forms.ValidationError("Email is not registered.")

        return cleaned_data


class PasswordForm(forms.Form):
    password = forms.CharField(max_length=200,
                               label='Old Password',
                               widget=forms.PasswordInput())
    password1 = forms.CharField(max_length=200,
                                label='New Password',
                                widget=forms.PasswordInput())
    password2 = forms.CharField(max_length=200,
                                label='Confirm New Password',
                                widget=forms.PasswordInput())

    def clean(self):
        cleaned_data = super(PasswordForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Password does not match.")

        return cleaned_data


class ResetForm(forms.Form):
    password1 = forms.CharField(max_length=200,
                                label='New Password',
                                widget=forms.PasswordInput())
    password2 = forms.CharField(max_length=200,
                                label='Confirm New Password',
                                widget=forms.PasswordInput())

    def clean(self):
        cleaned_data = super(ResetForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Password does not match.")


class EditFrom(forms.Form):
    first_name = forms.CharField(max_length=20, required=False)
    last_name = forms.CharField(max_length=20, required=False)
    age = forms.IntegerField(required=False, validators=[MaxValueValidator(100), MinValueValidator(0)])
    bio = forms.CharField(max_length=420, required=False)
    picture = models.ImageField(upload_to="profile-photos")


class DifficultyForm(forms.Form):
    difficulty = forms.CharField(max_length=10, required=True)


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ('title','description','author','document','level','cover','category')

class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ('name','picture')