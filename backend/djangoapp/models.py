from django.db import models
from django.contrib.auth.models import User


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    COUPE = 'Coupe'
    HATCHBACK = 'Hatchback'
    CONVERTIBLE = 'Convertible'

    TYPE_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (COUPE, 'Coupe'),
        (HATCHBACK, 'Hatchback'),
        (CONVERTIBLE, 'Convertible'),
    ]

    make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    dealer_id = models.IntegerField(help_text='ID dealer pada sumber eksternal/NoSQL')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=SEDAN)
    year = models.PositiveIntegerField()

    class Meta:
        unique_together = ('make', 'name', 'year')

    def __str__(self):
        return f"{self.make.name} {self.name} {self.year}"


class Question(models.Model):
    text = models.CharField(max_length=255)
    pub_date = models.DateTimeField(auto_now_add=True)
    grade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.text

    def is_correct_submission(self, submission: 'Submission') -> bool:
        correct_choices = set(self.choices.filter(is_correct=True).values_list('id', flat=True))
        selected_choices = set(
            submission.choices.filter(question=self).values_list('id', flat=True)
        )
        return correct_choices == selected_choices


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    choices = models.ManyToManyField(Choice, related_name='submissions')

    def score(self) -> int:
        questions = Question.objects.filter(choices__in=self.choices.all()).distinct()
        score = 0
        for q in questions:
            if q.is_correct_submission(self):
                score += q.grade
        return score

    def __str__(self):
        return f"Submission #{self.pk} by {self.user.username}"
