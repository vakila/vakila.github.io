---
layout: page
title: Talks
---

<div>
{% for talk in site.talks reversed %}
  {% if talk.date > site.time %}
    {% if forloop.first %}
      <h2 class="talk-section" id="upcoming">Upcoming</h2>
    {% endif %}
  {% else %}
    {% assign currentyear = talk.date | date: "%Y" %}
    {% if currentyear != previousyear %}
      <h2 class="talk-section" id="y{{ talk.date | date: "%Y"}}">{{ currentyear }}</h2>
      {% assign previousyear = currentyear %}
    {% endif %}
  {% endif %}


    <div class="talk">
      <h4 class="post-title"> {{ talk.title }} </h4>
      {% if talk.subtitle %}<span class="post-date talk-subtitle"> {{ talk.subtitle }} </span>{% endif %}

      <i class="fa fa-comments-o" aria-hidden="true"></i>
      {% if talk.event-url %}
      <a href="{{ talk.event-url }}"
       title="{% if talk.event-fulltitle %}{{ talk.event-fulltitle }}{% else %}{{ talk.event }}{% endif %}
{{ talk.event-url }}">
      {% endif %}
      {{ talk.event }}{% if talk.event-fulltitle %}: {{ talk.event-fulltitle }}{% endif %}
      {% if talk.event-url %}</a>{% endif %}
      <br>
      <span class="location">
        <i class="fa fa-map-marker" aria-hidden="true"></i>
        {{ talk.location }}
      </span>
      <br>
      <i class="fa fa-calendar" aria-hidden="true"></i> {{ talk.date | date: "%B %-d, %Y" }}
      <br>
      {% if talk.slides %}
        <span class="talk-resource">
          <i class="fa fa-file-pdf-o" aria-hidden="true"></i>
          {% if talk.slides contains ".pdf" %}
            <a href="{{ site.pdfs }}/{{ talk.slides }}">
          {% else %}
            <a href="{{ talk.slides }}">
          {% endif %}
          Slides</a>
        </span>
      {% endif %}
      {% if talk.video %}
        <span class="talk-resource"><i class="fa fa-file-video-o" aria-hidden="true"></i> <a href="{{ talk.video }}">Video</a></span>
      {% endif %}
      {% if talk.post %}
        <span class="talk-resource">
          <i class="fa fa-file-text-o" aria-hidden="true"></i>
          <a href="{{ site.baseurl }}/blog/{{ talk.post }}">Post</a>
        </span>
      {% endif %}


    </div>
{% endfor %}
</div>
