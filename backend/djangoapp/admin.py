from django.contrib import admin
from .models import CarMake, CarModel, Question, Choice, Submission


class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 1


@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    inlines = [CarModelInline]


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ("name", "make", "type", "year", "dealer_id")
    list_filter = ("make", "type", "year")
    search_fields = ("name",)


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "pub_date", "grade")
    inlines = [ChoiceInline]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at")
    filter_horizontal = ("choices",)
