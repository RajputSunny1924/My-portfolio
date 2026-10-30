import { useState } from "react";
import projects from "../data/projects";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      {/* =========================
          PROJECTS SECTION
      ========================= */}

      <section id="projects">
        <h2 data-reveal>My Projects</h2>

        <p data-reveal>Click on a project to explore its details.</p>

        <div>
          {projects.map((project) => (
            <div key={project.id} className="project-card" data-reveal>
              <h3>{project.title}</h3>

              <p>{project.tech}</p>

              <p>{project.description}</p>

              <button
                onClick={() => {
                  setSelectedProject(project);

                  setTimeout(() => {
                    document.getElementById("project-details")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}>
                View Project
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          PROJECT DETAIL
      ========================= */}

      {selectedProject && (
        <section id="project-details" className="project-detail" data-reveal>
          <h2>{selectedProject.title}</h2>

          <h3>Technology</h3>
          <p>{selectedProject.tech}</p>

          <h3>Overview</h3>
          <p>{selectedProject.description}</p>

          <h3>What I Built</h3>

          <div>
            {selectedProject.features.map((feature, index) => (
              <p key={index}>• {feature}</p>
            ))}
          </div>

          <h3>Architecture</h3>

          <pre>{selectedProject.architecture}</pre>

          {selectedProject.structure && (
            <>
              <h3>Project Structure</h3>

              <pre>{selectedProject.structure}</pre>
            </>
          )}

          {selectedProject.flow && (
            <>
              <h3>{selectedProject.flowTitle}</h3>

              <pre>{selectedProject.flow}</pre>
            </>
          )}

          {selectedProject.security && (
            <>
              <h3>Security</h3>

              <div>
                {selectedProject.security.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>
            </>
          )}

          {selectedProject.apis && (
            <>
              <h3>API Endpoints</h3>

              <div>
                {selectedProject.apis.map((api, index) => (
                  <p key={index}>• {api}</p>
                ))}
              </div>
            </>
          )}

          <h3>Problems & Solutions</h3>

          <div>
            {selectedProject.problems.map((problem, index) => (
              <p key={index}>• {problem}</p>
            ))}
          </div>

          <h3>Future Improvements</h3>

          <div>
            {selectedProject.future.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}
          </div>

          <button
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}>
            Back to Projects
          </button>
        </section>
      )}
    </>
  );
}

export default Projects;
