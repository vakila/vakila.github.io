---
layout: page
title: Talks
---

<div>
  {% for talk in site.talks reversed %}
      <div class="talk">
        <h4 class="post-title"> {{ talk.title }} </h4>
        {% if talk.subtitle %}<span class="post-date talk-subtitle"> {{ talk.subtitle }} </span>{% endif %}

        {{ talk.year }}:
        {% if talk.event-url %}
        <a href="{{ talk.event-url }}"
         title="{% if talk.event-fulltitle %}{{ talk.event-fulltitle }}{% else %}{{ talk.event }}{% endif %}
{{ talk.event-url }}">
        {% endif %}
        {{ talk.event }}{% if talk.event-url %}</a>{% endif %},
        {{ talk.location }}.
        <a href="{{ site.baseurl }}/pdf/{{ talk.slides }}">[slides]</a>
      </div>
  {% endfor %}
</div>
