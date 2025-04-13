import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import random  # For demo data, replace with actual database connection

# Page configuration
st.set_page_config(
    page_title="Skill Barter Analytics",
    page_icon="📊",
    layout="wide"
)

# Title and description
st.title("📊 Skill Barter Analytics Dashboard")
st.markdown("### Top Skills of the Week")

# Demo data (Replace this with actual database connection)
def generate_demo_data():
    skills = [
        "React", "Python", "JavaScript", "SQL", "Machine Learning",
        "Data Science", "Java", "Node.js", "TypeScript", "Docker"
    ]
    
    data = {
        'skill': skills,
        'teaching_requests': [random.randint(5, 50) for _ in range(len(skills))],
        'learning_requests': [random.randint(5, 50) for _ in range(len(skills))]
    }
    return pd.DataFrame(data)

# Get data
df = generate_demo_data()

# Create two columns for the visualizations
col1, col2 = st.columns(2)

with col1:
    st.subheader("Most Requested Skills to Learn")
    fig1 = px.bar(
        df.nlargest(5, 'learning_requests'),
        x='skill',
        y='learning_requests',
        color='learning_requests',
        color_continuous_scale='Oranges',
    )
    fig1.update_layout(
        xaxis_title="Skill",
        yaxis_title="Number of Learning Requests",
        showlegend=False
    )
    st.plotly_chart(fig1, use_container_width=True)

with col2:
    st.subheader("Most Offered Skills to Teach")
    fig2 = px.bar(
        df.nlargest(5, 'teaching_requests'),
        x='skill',
        y='teaching_requests',
        color='teaching_requests',
        color_continuous_scale='Greens',
    )
    fig2.update_layout(
        xaxis_title="Skill",
        yaxis_title="Number of Teaching Offers",
        showlegend=False
    )
    st.plotly_chart(fig2, use_container_width=True)

# Skill Match Opportunities
st.markdown("### 🤝 Skill Match Opportunities")
fig3 = go.Figure()

fig3.add_trace(go.Scatter(
    x=df['skill'],
    y=df['learning_requests'],
    name='Learning Requests',
    line=dict(color='#FF772A', width=2)
))

fig3.add_trace(go.Scatter(
    x=df['skill'],
    y=df['teaching_requests'],
    name='Teaching Offers',
    line=dict(color='#8CAB6A', width=2)
))

fig3.update_layout(
    title="Learning Requests vs Teaching Offers",
    xaxis_title="Skills",
    yaxis_title="Number of Requests/Offers",
    hovermode='x unified'
)

st.plotly_chart(fig3, use_container_width=True)

# Add requirements.txt 