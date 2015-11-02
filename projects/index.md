---
layout: default
title: Projects
---

<div class="projects">
  {% for project in site.projects %}
  <div class="project post">
    <h1 class="project-title post-title">
      <a href="{{ project.website }}">
        {{ project.title }}
      </a>
    </h1>
    <span class="project-tagline post-date">
        {{ project.tagline }}
    </span>

    {{ project.content }}


  </div>
  {% endfor %}
</div>
